<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class FileEncryptionService
{
    /**
     * Encrypt and store a file
     */
    public function encryptAndStore($file, $path = 'encrypted')
    {
        try {
            // Generate a unique filename
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $encryptedFilename = Str::uuid() . '.' . $extension;

            // Read file content
            $fileContent = file_get_contents($file->getRealPath());

            // Encrypt the content
            $encryptedContent = Crypt::encrypt($fileContent);

            // Store encrypted file in S3
            $fullPath = $path . '/' . $encryptedFilename;
            try {
                Storage::disk('s3')->put($fullPath, $encryptedContent, [
                    'visibility' => 'private',
                    'metadata' => [
                        'encrypted' => 'true',
                        'original_name' => $originalName
                    ]
                ]);
            } catch (\Exception $e) {
                throw new \Exception('Failed to store encrypted file: ' . $e->getMessage());
            }

            return [
                'encrypted_filename' => $encryptedFilename,
                'file_path' => $fullPath,
                'original_filename' => $originalName,
                'file_size' => $file->getSize(),
                'file_type' => $extension,
            ];
        } catch (\Exception $e) {
            throw new \Exception('File encryption failed: ' . $e->getMessage());
        }
    }

    /**
     * Decrypt and retrieve a file
     */
    public function decryptAndRetrieve($encryptedFilePath, $originalFilename = null)
    {
        try {
            // Get encrypted content from S3
            $encryptedContent = Storage::disk('s3')->get($encryptedFilePath);

            if (!$encryptedContent) {
                throw new \Exception('Encrypted file not found');
            }

            // Decrypt the content
            $decryptedContent = Crypt::decrypt($encryptedContent);

            // Create a temporary file
            $tempPath = tempnam(sys_get_temp_dir(), 'decrypted_');
            file_put_contents($tempPath, $decryptedContent);

            return [
                'temp_path' => $tempPath,
                'content' => $decryptedContent,
                'original_filename' => $originalFilename,
            ];
        } catch (\Exception $e) {
            throw new \Exception('File decryption failed: ' . $e->getMessage());
        }
    }

    /**
     * Delete encrypted file from storage
     */
    public function deleteEncryptedFile($encryptedFilePath)
    {
        try {
            return Storage::disk('s3')->delete($encryptedFilePath);
        } catch (\Exception $e) {
            throw new \Exception('Failed to delete encrypted file: ' . $e->getMessage());
        }
    }

    /**
     * Check if file exists in encrypted storage
     */
    public function fileExists($encryptedFilePath)
    {
        return Storage::disk('s3')->exists($encryptedFilePath);
    }
}
