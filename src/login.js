import './style.css'

// اگر قبلاً وارد شده، مستقیم برو به پنل
if (sessionStorage.getItem('crm-auth') || localStorage.getItem('crm-auth')) {
  location.replace('/app.html')
}

const $ = (s) => document.querySelector(s)
const form = $('#loginForm')
const username = $('#username')
const password = $('#password')
const loginError = $('#loginError')

function setError(input, key, show) {
  input.classList.toggle('field-error', show)
  document.querySelector(`[data-err="${key}"]`)?.classList.toggle('show', show)
}

username.addEventListener('input', () => setError(username, 'username', false))
password.addEventListener('input', () => setError(password, 'password', false))

$('#togglePass').addEventListener('click', () => {
  const show = password.type === 'password'
  password.type = show ? 'text' : 'password'
  $('#eyeIcon').style.opacity = show ? '.45' : '1'
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  loginError.classList.add('hidden')

  const u = username.value.trim()
  const p = password.value.trim()
  let valid = true
  if (!u) { setError(username, 'username', true); valid = false }
  if (!p) { setError(password, 'password', true); valid = false }
  if (!valid) { form.classList.remove('animate-shake'); void form.offsetWidth; form.classList.add('animate-shake'); return }

  const btn = $('#loginBtn')
  btn.disabled = true
  $('#loginBtnText').textContent = 'در حال بررسی...'
  $('#loginSpinner').classList.remove('hidden')
  $('#loginArrow').classList.add('hidden')

  setTimeout(() => {
    if (u === 'admin' && p === '1234') {
      const store = $('#remember').checked ? localStorage : sessionStorage
      store.setItem('crm-auth', '1')
      store.setItem('crm-user', u)
      location.replace('/app.html')
    } else {
      btn.disabled = false
      $('#loginBtnText').textContent = 'ورود به پنل مدیریت'
      $('#loginSpinner').classList.add('hidden')
      $('#loginArrow').classList.remove('hidden')
      loginError.textContent = 'نام کاربری یا رمز عبور اشتباه است. (نمایشی: admin / 1234)'
      loginError.classList.remove('hidden')
      form.classList.remove('animate-shake'); void form.offsetWidth; form.classList.add('animate-shake')
    }
  }, 900)
})
