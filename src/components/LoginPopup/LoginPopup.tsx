import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { XIcon } from '@/icons';
import { Input, Button } from '@/components';
import {
  loginSchema,
  registerSchema,
  LoginFormData,
  RegisterFormData,
} from '@/schemas/user';

interface LoginPopupProps {
  setShowLogin: (show: boolean) => void;
  onLoginSuccess?: () => void;
}

const MOCK_ACCOUNT = {
  username: 'admin',
  password: '123',
};

const LoginPopup = ({ setShowLogin, onLoginSuccess }: LoginPopupProps) => {
  const [currentState, setCurrentState] = useState<'login' | 'register'>(
    'login',
  );
  const [error, setError] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      account: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: '',
      userEmail: '',
      account: '',
      password: '',
    },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    setError('');
    if (
      data.account === MOCK_ACCOUNT.username &&
      data.password === MOCK_ACCOUNT.password
    ) {
      alert('Đăng nhập thành công!');
      onLoginSuccess?.();
      setShowLogin(false);
    } else {
      setError('Tài khoản hoặc mật khẩu không đúng');
    }
  };

  const onRegisterSubmit = (_data: RegisterFormData) => {
    setError('');
    alert('Đăng ký thành công!');
    setCurrentState('login');
    registerForm.reset();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowLogin(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowLogin]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentState === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </h2>
          <button
            onClick={() => setShowLogin(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {currentState === 'login' ? (
          <form
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            className="space-y-4"
          >
            <div>
              <Input
                type="text"
                placeholder="Tên tài khoản"
                {...loginForm.register('account')}
              />
              {loginForm.formState.errors.account && (
                <p className="text-sm text-red-500 mt-1">
                  {loginForm.formState.errors.account.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Mật khẩu"
                {...loginForm.register('password')}
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              color="success"
              size="lg"
              className="w-full bg-[#28a745] hover:bg-[#218838] text-white"
            >
              Đăng nhập
            </Button>
          </form>
        ) : (
          <form
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            className="space-y-4"
          >
            <div>
              <Input
                type="text"
                placeholder="Tên của bạn"
                {...registerForm.register('userName')}
              />
              {registerForm.formState.errors.userName && (
                <p className="text-sm text-red-500 mt-1">
                  {registerForm.formState.errors.userName.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email của bạn"
                {...registerForm.register('userEmail')}
              />
              {registerForm.formState.errors.userEmail && (
                <p className="text-sm text-red-500 mt-1">
                  {registerForm.formState.errors.userEmail.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="text"
                placeholder="Tên tài khoản"
                {...registerForm.register('account')}
              />
              {registerForm.formState.errors.account && (
                <p className="text-sm text-red-500 mt-1">
                  {registerForm.formState.errors.account.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Mật khẩu"
                {...registerForm.register('password')}
              />
              {registerForm.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              color="success"
              size="lg"
              className="w-full bg-[#28a745] hover:bg-[#218838] text-white"
            >
              Tạo tài khoản mới
            </Button>
          </form>
        )}

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            required
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <p className="text-sm text-gray-600">Tôi đồng ý với các điều khoản</p>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          {currentState === 'login' ? (
            <>
              Bạn muốn tạo tài khoản?{' '}
              <span
                onClick={() => setCurrentState('register')}
                className="text-primary font-semibold cursor-pointer hover:underline"
              >
                Bấm vào đây
              </span>
            </>
          ) : (
            <>
              Bạn đã có tài khoản?{' '}
              <span
                onClick={() => setCurrentState('login')}
                className="text-primary font-semibold cursor-pointer hover:underline"
              >
                Đăng nhập
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;
