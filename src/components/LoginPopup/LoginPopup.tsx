import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { XIcon } from '@/icons';
import { Input, Button } from '@/components';
import {
  loginSchema,
  registerSchema,
  LoginFormData,
  RegisterFormData,
} from '@/schemas/user';
import authService from '@/apis/Authentication/auth';
import { USER_ROUTES } from '@/constants/routes';

interface LoginPopupProps {
  setShowLogin: (show: boolean) => void;
  onLoginSuccess?: () => void;
}

const LoginPopup = ({ setShowLogin, onLoginSuccess }: LoginPopupProps) => {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState<'login' | 'register'>(
    'login',
  );
  const [error, setError] = useState('');
  const [_isLoading, setIsLoading] = useState(false);
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

  const onLoginSubmit = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);
    try {
      const result = await authService.signin({
        account: data.account,
        password: data.password,
      });

      if (result.success) {
        toast.success(result.message || 'Đăng nhập thành công!');
        onLoginSuccess?.();
        setShowLogin(false);

        // Auto redirect based on user role
        const primaryRole = authService.getPrimaryRole();
        if (primaryRole === 'admin') {
          navigate(USER_ROUTES.US0013_ADMIN_DASHBOARD);
        } else if (primaryRole === 'shipper') {
          navigate(USER_ROUTES.US0012_SHIPPER_ORDERS);
        } else {
          // Default to user home page
          navigate(USER_ROUTES.US0001_HOME);
        }
      } else {
        setError(result.message || 'Đăng nhập thất bại');
        toast.error(result.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      const errorMessage = 'Có lỗi xảy ra khi đăng nhập';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setError('');
    setIsLoading(true);
    try {
      const result = await authService.register({
        account: data.account,
        password: data.password,
        userName: data.userName,
        userEmail: data.userEmail,
      });

      if (result.success) {
        toast.success(result.message || 'Đăng ký thành công!');
        setCurrentState('login');
        registerForm.reset();
      } else {
        setError(result.message || 'Đăng ký thất bại');
        toast.error(result.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      const errorMessage = 'Có lỗi xảy ra khi đăng ký';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
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
              disabled={_isLoading}
            >
              {_isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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
              disabled={_isLoading}
            >
              {_isLoading ? 'Đang đăng ký...' : 'Tạo tài khoản mới'}
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
