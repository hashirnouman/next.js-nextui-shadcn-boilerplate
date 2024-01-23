import React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { useRouter } from 'next/router';
import en from '@/locales/en';
import ar from '@/locales/ar';

interface ConfirmationDialogProps {
  onConfirmed: () => void;
  onCancel: () => void;
  isOpen: boolean;
  title : string;
  description : string;
  isLoading : boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  onConfirmed,
  onCancel,
  isOpen,
  title,
  description,
  isLoading
}) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : ar;
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger>
        {/* <button className='hidden' /> */}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{t.cancel}</AlertDialogCancel>
          <AlertDialogAction isLoading={isLoading} disabled={isLoading} onClick={onConfirmed}>{t.continue}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
