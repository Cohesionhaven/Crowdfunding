import React from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { Card, CardContent } from '../ui/Card';

export const SignUp: React.FC = () => {
  return (
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <CardContent>
          <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
          <ClerkSignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
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