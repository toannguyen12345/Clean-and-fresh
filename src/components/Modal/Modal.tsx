import { ReactNode } from 'react';

import { XIcon } from '@/icons';

import Button from '../Button/Button';

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}: IModalProps): JSX.Element | null => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div
          className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md ${className}`}
        >
          {/* Header */}
          {title && (
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4">{children}</div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <Button color="secondary" outline onClick={onClose}>
              Hủy
            </Button>
            <Button color="primary" onClick={onClose}>
              Xác nhận
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
