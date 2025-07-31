import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Shield, Lock, Eye, Database, Cloud } from 'lucide-react';

interface PrivacyNoticeProps {
  className?: string;
}

export function PrivacyNotice({ className }: PrivacyNoticeProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Data Security & Privacy
        </CardTitle>
        <CardDescription>
          Your data security is our top priority. Here's how we protect your information:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <span className="font-medium">End-to-End Encryption</span>
            </div>
            <p className="text-sm text-muted-foreground">
              All uploaded files are encrypted using AES-256 encryption before being stored in secure cloud storage.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Secure Storage</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Encrypted files are stored in secure cloud storage with enterprise-grade security measures.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-orange-600" />
              <span className="font-medium">AI Processing Privacy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              While we use AI to generate widgets, your raw data is never shared with external AI models or third parties.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-green-600" />
              <span className="font-medium">Cloudflare R2 Storage</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Files are stored in Cloudflare R2 with automatic encryption and global CDN distribution.
            </p>
          </div>
        </div>
        
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Important Privacy Information
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Your files are encrypted before being uploaded to our secure storage</li>
            <li>• Only authorized users can access their own encrypted files</li>
            <li>• AI-generated widgets are created from processed data, not raw files</li>
            <li>• No personal or sensitive data is shared with external AI services</li>
            <li>• All data processing happens within our secure infrastructure</li>
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            <Lock className="h-3 w-3 mr-1" />
            AES-256 Encryption
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            GDPR Compliant
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Database className="h-3 w-3 mr-1" />
            Secure Cloud Storage
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Private AI Processing
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
} 