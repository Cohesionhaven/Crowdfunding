import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Card, CardContent } from '../ui/Card';

export const SignIn: React.FC = () => {
  return (
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <CardContent>
          <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
          <ClerkSignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl="/"
            appearance={{
              elements: {
                rootBox: 'mx-auto w-full',
                card: 'shadow-none p-0',
                footer: 'text-center'
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};