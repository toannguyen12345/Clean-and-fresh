import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { generateLoginSchema, TLoginForm } from '@/schemas';

const HomePage = () => {
  const { t } = useTranslation('common');
  const methods = useForm<TLoginForm>({
    resolver: zodResolver(generateLoginSchema(t)),
  });
  console.warn(methods);

  return <div>{t('welcome')}</div>;
};

export default HomePage;
