/**
 * Lógica de Autenticação para a Extensão Despacho IA
 * Conecta diretamente ao Supabase do projeto SO-Plataforma.
 */

// PBKDF2 configuration (mesma do backend da SO-Plataforma)
const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const HASH_LENGTH = 32;

function arrayToHex(array) {
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToArray(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  return crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    passwordKey,
    HASH_LENGTH * 8
  );
}

async function verifyPassword(password, storedHash) {
  // Check se é formato novo (PBKDF2 com salt:hash)
  if (storedHash.includes(':')) {
    const [saltHex, hashHex] = storedHash.split(':');
    const salt = hexToArray(saltHex);
    const hashBuffer = await deriveKey(password, salt);
    const computedHash = arrayToHex(new Uint8Array(hashBuffer));
    return computedHash === hashHex;
  }

  // Fallback para Legacy SHA-256
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const legacyHash = arrayToHex(new Uint8Array(hashBuffer));
  return legacyHash === storedHash;
}

const Auth = {
  async verificarSessao() {
    return new Promise(resolve => {
      chrome.storage.local.get(['sessao_valida', 'sessao_email'], data => {
        if (data.sessao_valida && data.sessao_email) {
          resolve({ autenticado: true, email: data.sessao_email });
        } else {
          resolve({ autenticado: false });
        }
      });
    });
  },

  async login(email, senha) {
    try {
      const emailLower = email.toLowerCase().trim();
      const response = await fetch(`${SUPABASE_URL}/rest/v1/app_users?username=eq.${encodeURIComponent(emailLower)}&select=password,approved`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erro ao conectar ao servidor de autenticação.');

      const users = await response.json();
      
      if (!users || users.length === 0) {
        return { ok: false, erro: 'Usuário não encontrado ou credenciais incorretas.' };
      }

      const user = users[0];
      
      const isSenhaCorreta = await verifyPassword(senha, user.password);
      if (!isSenhaCorreta) {
        return { ok: false, erro: 'Senha incorreta.' };
      }

      if (!user.approved) {
        return { ok: false, erro: 'Seu cadastro na SO-Plataforma ainda não foi aprovado pelo administrador.' };
      }

      // Salva sessão no chrome.storage
      await new Promise(resolve => {
        chrome.storage.local.set({ 
          sessao_valida: true, 
          sessao_email: emailLower 
        }, resolve);
      });

      // Opcional: Registrar login no user_sessions (fire and forget)
      try {
        fetch(`${SUPABASE_URL}/rest/v1/user_sessions`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            username: emailLower,
            session_token: 'ext_' + crypto.randomUUID(),
            ip_address: 'extensao-chrome',
            user_agent: navigator.userAgent,
            is_active: true
          })
        });
      } catch (e) { console.warn('Erro ao salvar user_sessions', e); }

      return { ok: true, email: emailLower };

    } catch (e) {
      console.error(e);
      return { ok: false, erro: 'Erro de conexão: ' + e.message };
    }
  },

  async logout() {
    return new Promise(resolve => {
      chrome.storage.local.remove(['sessao_valida', 'sessao_email'], resolve);
    });
  }
};
