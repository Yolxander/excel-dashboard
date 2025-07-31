<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class FileEncryptionService
{
    /**
     * Encrypt and store a file
     */
    public function encryptAndStore($file, $path = 'encrypted')
    {
        try {
            Log::info('Starting file encryption process', [
                'original_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'file_type' => $file->getClientOriginalExtension(),
                'path' => $path
            ]);

            // Generate a unique filename
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $encryptedFilename = Str::uuid() . '.' . $extension;

            Log::info('Generated encrypted filename', [
                'original_name' => $originalName,
                'encrypted_filename' => $encryptedFilename,
                'extension' => $extension
            ]);

            // Read file content
            Log::info('Reading file content from disk');
            $fileContent = file_get_contents($file->getRealPath());
            Log::info('File content read successfully', [
                'content_size' => strlen($fileContent),
                'file_path' => $file->getRealPath()
            ]);

            // Encrypt the content
            Log::info('Starting file encryption with Laravel Crypt');
            $encryptedContent = Crypt::encrypt($fileContent);
            Log::info('File encryption completed successfully', [
                'original_size' => strlen($fileContent),
                'encrypted_size' => strlen($encryptedContent),
                'compression_ratio' => round((strlen($encryptedContent) / strlen($fileContent)) * 100, 2) . '%'
            ]);

            // Store encrypted file in S3
            $fullPath = $path . '/' . $encryptedFilename;
            Log::info('Preparing to upload encrypted file to S3', [
                's3_path' => $fullPath,
                'encrypted_size' => strlen($encryptedContent),
                'visibility' => 'private'
            ]);

            try {
                Log::info('Initiating S3 upload');
                $uploadResult = Storage::disk('s3')->put($fullPath, $encryptedContent, [
                    'visibility' => 'private',
                    'metadata' => [
                        'encrypted' => 'true',
                        'original_name' => $originalName,
                        'uploaded_at' => now()->toISOString(),
                        'encryption_method' => 'Laravel_Crypt_AES_256'
                    ]
                ]);

                if ($uploadResult) {
                    Log::info('S3 upload completed successfully', [
                        's3_path' => $fullPath,
                        'file_size' => $file->getSize(),
                        'encrypted_size' => strlen($encryptedContent)
                    ]);
                } else {
                    Log::error('S3 upload failed - returned false');
                    throw new \Exception('S3 upload returned false');
                }

            } catch (\Exception $e) {
                Log::error('S3 upload failed', [
                    'error' => $e->getMessage(),
                    's3_path' => $fullPath,
                    'file_size' => strlen($encryptedContent)
                ]);
                throw new \Exception('Failed to store encrypted file: ' . $e->getMessage());
            }

            Log::info('File encryption and storage process completed successfully', [
                'original_name' => $originalName,
                'encrypted_filename' => $encryptedFilename,
                's3_path' => $fullPath,
                'file_size' => $file->getSize(),
                'encrypted_size' => strlen($encryptedContent)
            ]);

            return [
                'encrypted_filename' => $encryptedFilename,
                'file_path' => $fullPath,
                'original_filename' => $originalName,
                'file_size' => $file->getSize(),
                'file_type' => $extension,
            ];
        } catch (\Exception $e) {
            Log::error('File encryption process failed', [
                'error' => $e->getMessage(),
                'original_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'stack_trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('File encryption failed: ' . $e->getMessage());
        }
    }

    /**
     * Decrypt and retrieve a file
     */
    public function decryptAndRetrieve($encryptedFilePath, $originalFilename = null)
    {
        try {
            Log::info('Starting file decryption process', [
                'encrypted_file_path' => $encryptedFilePath,
                'original_filename' => $originalFilename
            ]);

            // Get encrypted content from S3
            Log::info('Retrieving encrypted file from S3');
            $encryptedContent = Storage::disk('s3')->get($encryptedFilePath);

            if (!$encryptedContent) {
                Log::error('Encrypted file not found in S3', [
                    'encrypted_file_path' => $encryptedFilePath
                ]);
                throw new \Exception('Encrypted file not found');
            }

            Log::info('Encrypted file retrieved from S3 successfully', [
                'encrypted_size' => strlen($encryptedContent),
                's3_path' => $encryptedFilePath
            ]);

            // Decrypt the content
            Log::info('Starting file decryption with Laravel Crypt');
            $decryptedContent = Crypt::decrypt($encryptedContent);
            Log::info('File decryption completed successfully', [
                'encrypted_size' => strlen($encryptedContent),
                'decrypted_size' => strlen($decryptedContent)
            ]);

            // Create a temporary file
            $tempPath = tempnam(sys_get_temp_dir(), 'decrypted_');
            $writeResult = file_put_contents($tempPath, $decryptedContent);

            if ($writeResult === false) {
                Log::error('Failed to write decrypted content to temporary file', [
                    'temp_path' => $tempPath,
                    'content_size' => strlen($decryptedContent)
                ]);
                throw new \Exception('Failed to create temporary file');
            }

            Log::info('Temporary file created successfully', [
                'temp_path' => $tempPath,
                'file_size' => $writeResult,
                'original_filename' => $originalFilename
            ]);

            return [
                'temp_path' => $tempPath,
                'content' => $decryptedContent,
                'original_filename' => $originalFilename,
            ];
        } catch (\Exception $e) {
            Log::error('File decryption process failed', [
                'error' => $e->getMessage(),
                'encrypted_file_path' => $encryptedFilePath,
                'original_filename' => $originalFilename,
                'stack_trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('File decryption failed: ' . $e->getMessage());
        }
    }

    /**
     * Delete encrypted file from storage
     */
    public function deleteEncryptedFile($encryptedFilePath)
    {
        try {
            Log::info('Attempting to delete encrypted file from S3', [
                'encrypted_file_path' => $encryptedFilePath
            ]);

            // Check if file exists before deletion
            $fileExists = Storage::disk('s3')->exists($encryptedFilePath);
            Log::info('File existence check', [
                'encrypted_file_path' => $encryptedFilePath,
                'exists' => $fileExists
            ]);

            if (!$fileExists) {
                Log::warning('Attempted to delete non-existent file', [
                    'encrypted_file_path' => $encryptedFilePath
                ]);
                return false;
            }

            $deleteResult = Storage::disk('s3')->delete($encryptedFilePath);

            if ($deleteResult) {
                Log::info('Encrypted file deleted successfully from S3', [
                    'encrypted_file_path' => $encryptedFilePath
                ]);
            } else {
                Log::error('S3 delete operation returned false', [
                    'encrypted_file_path' => $encryptedFilePath
                ]);
            }

            return $deleteResult;
        } catch (\Exception $e) {
            Log::error('Failed to delete encrypted file from S3', [
                'error' => $e->getMessage(),
                'encrypted_file_path' => $encryptedFilePath,
                'stack_trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('Failed to delete encrypted file: ' . $e->getMessage());
        }
    }

    /**
     * Check if file exists in encrypted storage
     */
    public function fileExists($encryptedFilePath)
    {
        try {
            Log::info('Checking if encrypted file exists in S3', [
                'encrypted_file_path' => $encryptedFilePath
            ]);

            $exists = Storage::disk('s3')->exists($encryptedFilePath);

            Log::info('File existence check result', [
                'encrypted_file_path' => $encryptedFilePath,
                'exists' => $exists
            ]);

            return $exists;
        } catch (\Exception $e) {
            Log::error('Error checking file existence in S3', [
                'error' => $e->getMessage(),
                'encrypted_file_path' => $encryptedFilePath,
                'stack_trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }
}
