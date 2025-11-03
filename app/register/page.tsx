import { Suspense } from 'react';
import { RegisterForm } from '@/components/RegisterForm';
import { RegisterFormSkeleton } from '@/components/RegisterFormSkeleton';

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFormSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}
