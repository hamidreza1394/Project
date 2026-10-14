import './style.css'

/* ---------- محافظ ورود ---------- */
if (!sessionStorage.getItem('crm-auth') && !localStorage.getItem('crm-auth')) {
  location.replace('/')
}

const $ = (s) => document.querySelector(s)
const $$ = (s) => [...document.querySelectorAll(s)]
const faNum = (n) => Number(n || 0).toLocaleString('fa-IR')
const digitsOnly = (v) => (v || '').replace(/[^\d]/g, '')

/* ---------- داده‌ها ---------- */
const KEY = 'crm-customers'
const seed = [
  { id: 1, type: 'person', name: 'رضا محمدی', national: '0012345678', mobile: '09123456789', phone: '02112345678', email: 'reza@gmail.com', province: 'تهران', city: 'تهران', postal: '', address: '', group: 'عمومی', level: 'VIP', credit: '50000000', desc: '', active: true, createdAt: Date.now() },
  { id: 2, type: 'company', name: 'شرکت پارس تجارت نوین', national: '10103456789', mobile: '09129876543', phone: '', email: 'info@parstejarat.ir', province: 'تهران', city: 'تهران', postal: '', address: '', group: 'سازمانی', level: 'طلایی', credit: '200000000', desc: '', active: true, createdAt: Date.now() },
  { id: 3, type: 'person', name: 'سارا احمدی', national: '0023456789', mobile: '09351234567', phone: '', email: '', province: 'اصفهان', city: 'اصفهان', postal: '', address: '', group: 'عمومی', level: 'عادی', credit: '', desc: '', active: true, createdAt: Date.now() - 86400000 },
  { id: 4, type: 'person', name: 'علی رضایی', national: '0034567890', mobile: '09151234567', phone: '', email: 'ali.r@yahoo.com', province: 'خراسان رضوی', city: 'مشهد', postal: '', address: '', group: 'همکار', level: 'نقره‌ای', credit: '10000000', desc: '', active: false, createdAt: Date.now() - 172800000 },
  { id: 5, type: 'company', name: 'فروشگاه اینترنتی دیجی استایل', national: '14005678901', mobile: '09021112233', phone: '', email: '', province: 'البرز', city: 'کرج', postal: '', address: '', group: 'فروشگاه اینترنتی', level: 'طلایی', credit: '80000000', desc: '', active: true, createdAt: Date.now() - 259200000 },
]
let customers
try { customers = JSON.parse(localStorage.getItem(KEY)) || seed } catch { customers = seed }
if (!localStorage.getItem(KEY)) save()
function save() { localStorage.setItem(KEY, JSON.stringify(customers)) }

/* ---------- سایدبار ---------- */
const sidebar = $('#sidebar'), overlay = $('#overlay')
const openMobile = (open) => {
  sidebar.classList.toggle('sidebar-open', open)
  overlay.classList.toggle('hidden', !open)
}
$('#mobileMenuBtn').addEventListener('click', () => openMobile(true))
overlay.addEventListener('click', () => openMobile(false))

$('#collapseBtn').addEventListener('click', () => {
  const collapsed = sidebar.classList.toggle('sidebar-collapsed')
  $('#collapseIcon').style.transform = collapsed ? 'rotate(180deg)' : ''
})

$('#logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('crm-auth'); localStorage.removeItem('crm-auth')
  toast('با موفقیت خارج شدید. به امید دیدار 👋', 'success')
  setTimeout(() => location.replace('/'), 500)
})

$$('.nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    const nav = item.dataset.nav
    if (nav === 'list') { $('#listSection').scrollIntoView({ behavior: 'smooth' }); openMobile(false); return }
    if (nav === 'define') { window.scrollTo({ top: 0, behavior: 'smooth' }); openMobile(false); return }
    toast('این بخش در نسخه بعدی فعال می‌شود 🚀', 'info')
  })
})

/* ---------- اعلان (Toast) ---------- */
function toast(msg, type = 'success') {
  const colors = { success: 'border-emerald-200 bg-emerald-50 text-emerald-700', error: 'border-rose-200 bg-rose-50 text-rose-600', info: 'border-indigo-200 bg-indigo-50 text-indigo-700' }
  const icons = { success: 'M20 6 9 17l-5-5', error: 'M18 6 6 18M6 6l12 12', info: 'M12 16v-4M12 8h.01' }
  const el = document.createElement('div')
  el.className = `animate-toast flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-[12.5px] font-bold shadow-lg backdrop-blur ${colors[type]}`
  el.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="${icons[type]}"/></svg><span>${msg}</span>`
  $('#toasts').appendChild(el)
  setTimeout(() => { el.style.transition = 'all .4s'; el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; setTimeout(() => el.remove(), 400) }, 3400)
}

/* ---------- نوع مشتری ---------- */
let customerType = 'person'
const typeBtns = $$('.type-btn')
function setType(type) {
  customerType = type
  typeBtns.forEach((b) => {
    const on = b.dataset.type === type
    b.className = `type-btn flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-[13px] font-extrabold transition ${on ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`
  })
  const company = type === 'company'
  $('#companyFields').classList.toggle('hidden', !company)
  $('#companyFields').classList.toggle('contents', company)
  $('#nameLabel').textContent = company ? 'نام شرکت' : 'نام و نام خانوادگی'
  $('#nationalLabel').textContent = company ? 'شناسه ملی' : 'کد ملی'
  $('#f_name').placeholder = company ? 'مثلاً: شرکت پارس تجارت نوین' : 'مثلاً: رضا محمدی'
  $('#f_national').placeholder = company ? '10103456789' : '0012345678'
  $('#f_national').maxLength = company ? 11 : 10
}
typeBtns.forEach((b) => b.addEventListener('click', () => setType(b.dataset.type)))

/* ---------- وضعیت فعال ---------- */
$('#f_active').addEventListener('change', (e) => {
  const t = $('#statusText')
  t.textContent = e.target.checked ? 'فعال — امکان ثبت سفارش دارد' : 'غیرفعال — امکان ثبت سفارش ندارد'
  t.className = `mt-0.5 text-[11px] font-medium ${e.target.checked ? 'text-emerald-600' : 'text-rose-500'}`
})

/* ---------- قالب‌بندی اعتبار ---------- */
$('#f_credit').addEventListener('input', (e) => {
  const d = digitsOnly(e.target.value)
  e.target.value = d ? Number(d).toLocaleString('en-US') : ''
})

/* ---------- نوار پیشرفت فرم ---------- */
const requiredIds = ['f_name', 'f_national', 'f_mobile']
function updateProgress() {
  const filled = requiredIds.filter((id) => $('#' + id).value.trim()).length
  const pct = Math.round((filled / requiredIds.length) * 100)
  $('#progressBar').style.width = pct + '%'
  $('#progressText').textContent = faNum(pct) + '٪'
}
requiredIds.forEach((id) => $('#' + id).addEventListener('input', updateProgress))

/* ---------- اعتبارسنجی ---------- */
function setError(id, show, msg) {
  const input = $('#' + id)
  input.classList.toggle('field-error', show)
  const err = document.querySelector(`[data-err="${id}"]`)
  if (err) { if (msg) err.textContent = msg; err.classList.toggle('show', show) }
  return !show
}
function validate(data) {
  let ok = true
  ok = setError('f_name', !data.name.trim()) && ok
  if (data.type === 'person') ok = setError('f_national', !/^\d{10}$/.test(data.national), 'کد ملی معتبر (۱۰ رقم) وارد کنید.') && ok
  else ok = setError('f_national', !/^\d{10,11}$/.test(data.national), 'شناسه ملی معتبر (۱۰ یا ۱۱ رقم) وارد کنید.') && ok
  ok = setError('f_mobile', !/^09\d{9}$/.test(data.mobile)) && ok
  if (data.email) ok = setError('f_email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) && ok
  if (data.postal) ok = setError('f_postal', !/^\d{10}$/.test(data.postal)) && ok
  return ok
}
;['f_name', 'f_national', 'f_mobile', 'f_email', 'f_postal'].forEach((id) =>
  $('#' + id).addEventListener('input', () => setError(id, false)))

/* ---------- خواندن فرم ---------- */
function readForm() {
  return {
    id: $('#f_id').value ? Number($('#f_id').value) : null,
    type: customerType,
    name: $('#f_name').value.trim(),
    national: digitsOnly($('#f_national').value),
    regNo: $('#f_regNo').value.trim(),
    economic: digitsOnly($('#f_economic').value),
    agent: $('#f_agent').value.trim(),
    group: $('#f_group').value,
    mobile: digitsOnly($('#f_mobile').value),
    phone: digitsOnly($('#f_phone').value),
    email: $('#f_email').value.trim(),
    province: $('#f_province').value,
    city: $('#f_city').value.trim(),
    postal: digitsOnly($('#f_postal').value),
    address: $('#f_address').value.trim(),
    level: document.querySelector('input[name="level"]:checked')?.value || 'عادی',
    credit: digitsOnly($('#f_credit').value),
    desc: $('#f_desc').value.trim(),
    active: $('#f_active').checked,
  }
}

function resetForm() {
  $('#customerForm').reset()
  $('#f_id').value = ''
  $('#f_active').checked = true
  $('#f_active').dispatchEvent(new Event('change'))
  document.querySelector('input[name="level"][value="عادی"]').checked = true
  setType('person')
  $('#formTitle').textContent = 'فرم تعریف مشتری'
  $('#submitBtnText').textContent = 'ثبت مشتری'
  $('#cancelEditBtn').classList.add('hidden'); $('#cancelEditBtn').classList.remove('flex')
  $$('.field-error').forEach((f) => f.classList.remove('field-error'))
  $$('.err-msg').forEach((f) => f.classList.remove('show'))
  updateProgress()
}
$('#resetBtn').addEventListener('click', resetForm)
$('#cancelEditBtn').addEventListener('click', resetForm)

$('#customerForm').addEventListener('submit', (e) => {
  e.preventDefault()
  const data = readForm()
  if (!validate(data)) { toast('لطفاً خطاهای فرم را برطرف کنید.', 'error'); return }

  const dup = customers.find((c) => c.national === data.national && c.id !== data.id)
  if (dup) { setError('f_national', true, 'مشتری با این کد قبلاً ثبت شده است.'); toast('این مشتری قبلاً در سیستم ثبت شده است.', 'error'); return }

  if (data.id) {
    const i = customers.findIndex((c) => c.id === data.id)
    customers[i] = { ...customers[i], ...data }
    toast(`مشتری «${data.name}» با موفقیت ویرایش شد ✏️`)
  } else {
    customers.unshift({ ...data, id: Date.now(), createdAt: Date.now() })
    toast(`مشتری «${data.name}» با موفقیت ثبت شد 🎉`)
  }
  save(); render(); resetForm()
})

/* ---------- جدول و آمار ---------- */
const levelStyles = {
  'عادی': 'bg-slate-100 text-slate-600',
  'نقره‌ای': 'bg-slate-200/80 text-slate-700',
  'طلایی': 'bg-amber-100 text-amber-700',
  'VIP': 'bg-gradient-to-l from-amber-400 to-orange-400 text-white shadow-sm shadow-amber-200',
}
const avatarColors = ['from-indigo-500 to-violet-500', 'from-emerald-500 to-teal-500', 'from-rose-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-sky-500 to-blue-500', 'from-fuchsia-500 to-purple-500']
const initials = (name) => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('‌')

function render() {
  const q = ($('#tableSearch').value || '').trim()
  const level = $('#levelFilter').value
  const list = customers.filter((c) =>
    (!q || c.name.includes(q) || c.mobile.includes(q) || c.national.includes(q)) &&
    (!level || c.level === level))

  $('#customerRows').innerHTML = list.map((c, idx) => `
    <tr class="border-b border-slate-50 transition hover:bg-indigo-50/40">
      <td class="px-6 py-3.5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${avatarColors[(c.id + idx) % avatarColors.length]} text-[12px] font-black text-white shadow-sm">${initials(c.name)}</div>
          <div class="min-w-0">
            <p class="truncate text-[13px] font-extrabold text-slate-800">${c.name}</p>
            <p class="mt-0.5 text-[11px] text-slate-400" dir="ltr" style="text-align:right">${c.national}</p>
          </div>
        </div>
      </td>
      <td class="px-4 py-3.5"><span class="badge ${c.type === 'company' ? 'bg-violet-100 text-violet-700' : 'bg-sky-100 text-sky-700'}">${c.type === 'company' ? 'حقوقی' : 'حقیقی'}</span></td>
      <td class="px-4 py-3.5"><p class="text-[12.5px] font-bold text-slate-700" dir="ltr" style="text-align:right">${c.mobile}</p>${c.email ? `<p class="mt-0.5 max-w-[160px] truncate text-[11px] text-slate-400" dir="ltr" style="text-align:right">${c.email}</p>` : ''}</td>
      <td class="px-4 py-3.5 text-[12.5px] font-semibold text-slate-600">${c.city || c.province || '—'}</td>
      <td class="px-4 py-3.5"><span class="badge ${levelStyles[c.level] || levelStyles['عادی']}">${c.level === 'VIP' ? '👑 ' : ''}${c.level}</span></td>
      <td class="px-4 py-3.5"><span class="badge ${c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}"><span class="h-1.5 w-1.5 rounded-full ${c.active ? 'bg-emerald-500' : 'bg-rose-500'}"></span>${c.active ? 'فعال' : 'غیرفعال'}</span></td>
      <td class="px-6 py-3.5">
        <div class="flex items-center gap-1.5">
          <button data-edit="${c.id}" class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100" title="ویرایش">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
          <button data-del="${c.id}" class="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition hover:bg-rose-100" title="حذف">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('')

  $('#emptyState').classList.toggle('hidden', list.length > 0)
  $('#tableInfo').textContent = `نمایش ${faNum(list.length)} از ${faNum(customers.length)} مشتری`

  $('#statTotal').textContent = faNum(customers.length)
  $('#statActive').textContent = faNum(customers.filter((c) => c.active).length)
  $('#statVip').textContent = faNum(customers.filter((c) => c.level === 'VIP').length)
  const today = new Date().toDateString()
  $('#statToday').textContent = faNum(customers.filter((c) => new Date(c.createdAt).toDateString() === today).length)
  $('#customerCountBadge').textContent = faNum(customers.length)
}

$('#tableSearch').addEventListener('input', render)
$('#levelFilter').addEventListener('change', render)
$('#globalSearch').addEventListener('input', (e) => {
  $('#tableSearch').value = e.target.value
  render()
})
$('#globalSearch').addEventListener('focus', () => $('#listSection').scrollIntoView({ behavior: 'smooth', block: 'center' }))

/* ویرایش / حذف */
let deleteId = null
$('#customerRows').addEventListener('click', (e) => {
  const editBtn = e.target.closest('[data-edit]')
  const delBtn = e.target.closest('[data-del]')
  if (editBtn) {
    const c = customers.find((x) => x.id === Number(editBtn.dataset.edit))
    if (!c) return
    resetForm()
    setType(c.type)
    $('#f_id').value = c.id
    $('#f_name').value = c.name; $('#f_national').value = c.national
    $('#f_regNo').value = c.regNo || ''; $('#f_economic').value = c.economic || ''; $('#f_agent').value = c.agent || ''
    $('#f_group').value = c.group || 'عمومی'
    $('#f_mobile').value = c.mobile; $('#f_phone').value = c.phone || ''; $('#f_email').value = c.email || ''
    $('#f_province').value = c.province || 'تهران'; $('#f_city').value = c.city || ''; $('#f_postal').value = c.postal || ''
    $('#f_address').value = c.address || ''; $('#f_desc').value = c.desc || ''
    $('#f_credit').value = c.credit ? Number(c.credit).toLocaleString('en-US') : ''
    document.querySelector(`input[name="level"][value="${c.level}"]`)?.click()
    $('#f_active').checked = !!c.active; $('#f_active').dispatchEvent(new Event('change'))
    $('#formTitle').textContent = `ویرایش مشتری: ${c.name}`
    $('#submitBtnText').textContent = 'ذخیره تغییرات'
    $('#cancelEditBtn').classList.remove('hidden'); $('#cancelEditBtn').classList.add('flex')
    updateProgress()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast('اطلاعات مشتری در فرم بارگذاری شد.', 'info')
  }
  if (delBtn) {
    deleteId = Number(delBtn.dataset.del)
    const c = customers.find((x) => x.id === deleteId)
    $('#deleteName').textContent = `«${c?.name || ''}»`
    const m = $('#deleteModal'); m.classList.remove('hidden'); m.classList.add('flex')
  }
})
const closeModal = () => { const m = $('#deleteModal'); m.classList.add('hidden'); m.classList.remove('flex'); deleteId = null }
$('#cancelDelete').addEventListener('click', closeModal)
$('#deleteModal').addEventListener('click', (e) => { if (e.target.id === 'deleteModal') closeModal() })
$('#confirmDelete').addEventListener('click', () => {
  const c = customers.find((x) => x.id === deleteId)
  customers = customers.filter((x) => x.id !== deleteId)
  save(); render(); closeModal()
  toast(`مشتری «${c?.name || ''}» حذف شد.`, 'error')
})

render()
updateProgress()
