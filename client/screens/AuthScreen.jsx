import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../components/Button.jsx';

const AuthScreen = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && !name.trim()) {
      setError('Введите имя');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Введите email и пароль');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { name: name.trim(), email: email.trim(), password: password.trim() };

      const apiModule = await import('../services/authService.js');
      const action = mode === 'login' ? apiModule.login : apiModule.register;
      const { user, token } = await action(payload);

      onAuthSuccess(user, token);
    } catch (err) {
      console.error('Auth error', err);
      setError(err?.message || 'Ошибка авторизации');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen p-6 bg-gray-50">
      <header className="pt-6 pb-4 w-full text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">OquMarket</h1>
        <p className="text-gray-500">
          Войдите или зарегистрируйтесь, чтобы продолжить обучение
        </p>
      </header>

      <main className="flex-grow flex flex-col w-full max-w-md">
        <div className="flex mb-6 bg-white rounded-2xl p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              mode === 'login'
                ? 'bg-[#02fa1b] text-white shadow'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              mode === 'register'
                ? 'bg-[#02fa1b] text-white shadow'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Регистрация
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-4"
        >
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#02fa1b] focus:border-[#02fa1b]"
                placeholder="Ваше имя"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#02fa1b] focus:border-[#02fa1b]"
              placeholder="Ваша почта"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#02fa1b] focus:border-[#02fa1b]"
              placeholder="Минимум 6 символов"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-1">
              {error}
            </p>
          )}

          <div className="mt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? (mode === 'login' ? 'Входим...' : 'Регистрируем...')
                : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Продолжая, вы принимаете базовые условия использования сервиса.
        </p>
      </main>
    </div>
  );
};

AuthScreen.propTypes = {
  onAuthSuccess: PropTypes.func.isRequired,
};

export default AuthScreen;

