import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

function Account() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameStatus, setNameStatus] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) setFullName(profile.full_name ?? '');
    if (user) setNewEmail(user.email ?? '');
  }, [profile, user]);

  const handleSaveName = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNameStatus(null);
    const [{ error: profileError }, { error: metaError }] = await Promise.all([
      supabase.from('profiles').update({ full_name: fullName.trim(), updated_at: new Date().toISOString() }).eq('id', user.id),
      supabase.auth.updateUser({ data: { full_name: fullName.trim() } }),
    ]);
    setSaving(false);
    setNameStatus(profileError || metaError ? 'error' : 'ok');
  };

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEmailStatus(null);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setSaving(false);
    setEmailStatus(error ? 'error' : 'confirmation');
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);
    if (newPassword !== confirmPassword) {
      setPasswordStatus('mismatch');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus('short');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) {
      setPasswordStatus('error');
    } else {
      setPasswordStatus('ok');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  if (loading) return <p className="text-center my-5">Cargando...</p>;

  return (
    <div className="container my-5" style={{ maxWidth: '580px' }}>
      <h2 className="mb-4">Mi Cuenta</h2>

      {/* Nombre */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Nombre</h5>
          <form onSubmit={handleSaveName}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setNameStatus(null); }}
                placeholder="Tu nombre"
                required
              />
            </div>
            {nameStatus === 'ok' && <p className="text-success mb-2">Nombre actualizado.</p>}
            {nameStatus === 'error' && <p className="text-danger mb-2">Error al guardar.</p>}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              Guardar nombre
            </button>
          </form>
        </div>
      </div>

      {/* Email */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Email</h5>
          <form onSubmit={handleSaveEmail}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                value={newEmail}
                onChange={(e) => { setNewEmail(e.target.value); setEmailStatus(null); }}
                required
              />
            </div>
            {emailStatus === 'confirmation' && (
              <p className="text-success mb-2">Te enviamos un email de confirmación al nuevo correo.</p>
            )}
            {emailStatus === 'error' && <p className="text-danger mb-2">Error al actualizar el email.</p>}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              Cambiar email
            </button>
          </form>
        </div>
      </div>

      {/* Contraseña */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Contraseña</h5>
          <form onSubmit={handleSavePassword}>
            <div className="mb-3">
              <label className="form-label">Nueva contraseña</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordStatus(null); }}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordStatus(null); }}
                placeholder="Repetí la contraseña"
                required
              />
            </div>
            {passwordStatus === 'mismatch' && <p className="text-danger mb-2">Las contraseñas no coinciden.</p>}
            {passwordStatus === 'short' && <p className="text-danger mb-2">La contraseña debe tener al menos 6 caracteres.</p>}
            {passwordStatus === 'ok' && <p className="text-success mb-2">Contraseña actualizada.</p>}
            {passwordStatus === 'error' && <p className="text-danger mb-2">Error al cambiar la contraseña.</p>}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              Cambiar contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Account;
