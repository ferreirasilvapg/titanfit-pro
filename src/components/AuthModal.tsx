import React, { useState } from 'react';
import {
  cadastrarUsuarioNuvem,
  autenticarUsuarioNuvem,
  salvarSessaoUsuario,
} from '../core/titanCommercial.js';
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  X,
  Loader2,
  CheckCircle2,
  Cloud,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onAutenticado: (usuario: any) => void;
}

export const AuthModal: React.FC<Props> = ({
  aberto,
  onFechar,
  onAutenticado,
}) => {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [plano, setPlano] = useState<'basico' | 'premium'>('premium');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!aberto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      // Ativação instantânea de Família VIP com cupom ou senha mestre
      if (
        senha.toUpperCase().trim() === 'FAMILIAVIP' ||
        email.toUpperCase().trim() === 'FAMILIAVIP'
      ) {
        const usuarioFamilia = salvarSessaoUsuario({
          id: `familia_${Date.now()}`,
          email: email.includes('@') ? email.trim() : 'familia@titanfit.app',
          nome: nome.trim() || 'Membro da Família VIP',
          plano: 'premium',
          papel: 'familia_vip',
          autenticado: true,
          assinaturaAtiva: true,
          dataAssinatura: new Date().toISOString()
        });
        onAutenticado(usuarioFamilia);
        onFechar();
        return;
      }

      if (modo === 'login') {
        const usuario = await autenticarUsuarioNuvem(email, senha);
        onAutenticado(usuario);
        onFechar();
      } else {
        const usuario = await cadastrarUsuarioNuvem(email, senha, plano, nome);
        onAutenticado(usuario);
        onFechar();
      }
    } catch (err: any) {
      setErro(err.message || 'Falha ao autenticar. Verifique seus dados.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#111827] border border-slate-700 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative my-auto">
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Cloud className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {modo === 'login' ? 'Entrar na Conta Nuvem' : 'Criar Nova Conta'}
            </h3>
            <p className="text-xs text-slate-400">Sincronização contínua multi-aparelho</p>
          </div>
        </div>

        {/* Abas Login / Cadastro */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800 mb-4">
          <button
            type="button"
            onClick={() => { setModo('login'); setErro(null); }}
            className={`py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
              modo === 'login' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setModo('cadastro'); setErro(null); }}
            className={`py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
              modo === 'cadastro' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Atalho Rápido para o Dono Master */}
        <div className="mb-3.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-xs">👑 Acesso Dono</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">destaquenewspg@gmail.com</span>
          </div>
          <button
            type="button"
            onClick={async () => {
              setEmail('destaquenewspg@gmail.com');
              setSenha('admin123');
              setCarregando(true);
              try {
                const usuario = await autenticarUsuarioNuvem('destaquenewspg@gmail.com', 'master-access');
                onAutenticado(usuario);
                onFechar();
              } catch {
                onFechar();
              } finally {
                setCarregando(false);
              }
            }}
            className="text-[10px] font-black bg-amber-400 hover:bg-amber-300 text-slate-950 px-2 py-1 rounded-lg transition cursor-pointer"
          >
            Entrar como Dono
          </button>
        </div>

        {erro && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-2.5 rounded-xl mb-3">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {modo === 'cadastro' && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome ou apelido"
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {modo === 'cadastro' && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Plano Desejado
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPlano('basico')}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition ${
                    plano === 'basico' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold block">Básico</span>
                  <span className="text-emerald-400 font-extrabold text-[11px]">R$ 9,90/mês</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlano('premium')}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition ${
                    plano === 'premium' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold block">Premium VIP</span>
                  <span className="text-purple-400 font-extrabold text-[11px]">R$ 12,00/mês</span>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-3"
          >
            {carregando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{modo === 'login' ? 'Entrar no Aplicativo' : 'Concluir Cadastro'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Dados criptografados na nuvem</span>
        </div>
      </div>
    </div>
  );
};
