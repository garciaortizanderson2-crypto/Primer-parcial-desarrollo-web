/**
 * js/login.js — TechNova
 *
 * Lógica del formulario de inicio de sesión.
 *
 * NOTA EDUCATIVA: Las credenciales están escritas directamente en el
 * código JavaScript del cliente SOLO con fines demostrativos.
 * En una aplicación real esto no es seguro — la autenticación debe
 * realizarse en el servidor con HTTPS y contraseñas hasheadas.
 */

/* ── Credenciales de demo (solo educativo) ────────────── */
const CREDENCIALES = {
  usuario:    'admin',
  contrasena: 'technova2024'
};

/* ── Referencias al DOM ───────────────────────────────── */
const loginForm       = document.getElementById('login-form');
const inputUsuario    = document.getElementById('input-usuario');
const inputContrasena = document.getElementById('input-contrasena');
const errorUsuario    = document.getElementById('error-usuario');
const errorContrasena = document.getElementById('error-contrasena');
const loginAlert      = document.getElementById('login-alert');
const btnIngresar     = document.getElementById('btn-ingresar');

/* ── Funciones auxiliares ─────────────────────────────── */

/**
 * Muestra u oculta el mensaje de error de un campo.
 * @param {HTMLElement} campo
 * @param {HTMLElement} spanError
 * @param {string} mensaje - Vacío para limpiar el error.
 */
function mostrarErrorCampo(campo, spanError, mensaje) {
  spanError.textContent = mensaje;
  campo.style.borderColor = mensaje ? '#c00' : '';
}

/**
 * Muestra la alerta global del formulario.
 * @param {string} mensaje
 */
function mostrarAlerta(mensaje) {
  loginAlert.textContent = mensaje;
  loginAlert.classList.add('show');
}

/** Limpia todos los errores del formulario. */
function limpiarErrores() {
  mostrarErrorCampo(inputUsuario,    errorUsuario,    '');
  mostrarErrorCampo(inputContrasena, errorContrasena, '');
  loginAlert.classList.remove('show');
  loginAlert.textContent = '';
}

/**
 * Valida que los campos del formulario tengan valores válidos.
 * @returns {boolean} true si el formulario es válido.
 */
function validarFormulario() {
  let esValido = true;

  const usuario    = inputUsuario.value.trim();
  const contrasena = inputContrasena.value;

  if (!usuario) {
    mostrarErrorCampo(inputUsuario, errorUsuario, 'El usuario es obligatorio.');
    esValido = false;
  } else if (usuario.length < 3) {
    mostrarErrorCampo(inputUsuario, errorUsuario, 'Mínimo 3 caracteres.');
    esValido = false;
  } else {
    mostrarErrorCampo(inputUsuario, errorUsuario, '');
  }

  if (!contrasena) {
    mostrarErrorCampo(inputContrasena, errorContrasena, 'La contraseña es obligatoria.');
    esValido = false;
  } else if (contrasena.length < 6) {
    mostrarErrorCampo(inputContrasena, errorContrasena, 'Mínimo 6 caracteres.');
    esValido = false;
  } else {
    mostrarErrorCampo(inputContrasena, errorContrasena, '');
  }

  return esValido;
}

/* ── Evento submit ────────────────────────────────────── */
loginForm.addEventListener('submit', function(evento) {
  evento.preventDefault();
  limpiarErrores();

  if (!validarFormulario()) return;

  const usuario    = inputUsuario.value.trim();
  const contrasena = inputContrasena.value;

  if (usuario === CREDENCIALES.usuario && contrasena === CREDENCIALES.contrasena) {
    mostrarAlerta('Acceso correcto. Cargando...');
    btnIngresar.disabled = true;
    sessionStorage.setItem('tn-sesion',  'activa');
    sessionStorage.setItem('tn-usuario', usuario);
    setTimeout(function() {
      window.location.href = 'index.html';
    }, 800);
  } else {
    mostrarAlerta('Usuario o contraseña incorrectos.');
    inputContrasena.value = '';
    inputContrasena.focus();
  }
});

/* ── Limpiar errores al escribir ──────────────────────── */
inputUsuario.addEventListener('input',    function() { mostrarErrorCampo(inputUsuario,    errorUsuario,    ''); });
inputContrasena.addEventListener('input', function() { mostrarErrorCampo(inputContrasena, errorContrasena, ''); });
