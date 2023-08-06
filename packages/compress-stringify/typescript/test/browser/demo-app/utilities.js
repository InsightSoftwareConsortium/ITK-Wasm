function downloadFile(content, filename) {
  const url = URL.createObjectURL(new Blob([content]))
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'download'
  document.body.appendChild(a)
  function clickHandler(event) {
    setTimeout(() => {
      URL.revokeObjectURL(url)
      a.removeEventListener('click', clickHandler)
    }, 200)
  };
  a.addEventListener('click', clickHandler, false)
  a.click()
  return a
}

function escapeHtml(html) {
  const div = document.createElement('div');
  div.textContent = html;
  const escaped = div.innerHTML;
  div.remove()
  return escaped
}

function notify(title, message, variant = 'primary', icon = 'info-circle', duration = 3000) {
  const slAlert = Object.assign(document.createElement('sl-alert'), {
    variant,
    closable: true,
    duration: duration,
    innerHTML: `
      <sl-icon name="${icon}" slot="icon"></sl-icon>
      <strong>${escapeHtml(title)}</strong><br />
      ${escapeHtml(message)}
    `
  });

  document.body.append(slAlert);
  setTimeout(() => slAlert.toast(), 300)
}

function disableInputs(inputId) {
  document.querySelectorAll(`#${inputId} sl-button`).forEach(button => {
    button.disabled = true
  })
  document.querySelector(`#${inputId} sl-button[name="run"]`).loading = true
  document.querySelectorAll(`#${inputId} sl-checkbox`).forEach(checkbox => {
    checkbox.disabled = true
  })
  document.querySelectorAll(`#${inputId} sl-input`).forEach(input => {
    input.disabled = true
  })
}

function enableInputs(inputId) {
  document.querySelectorAll(`#${inputId} sl-button`).forEach(button => {
    button.disabled = false
  })
  document.querySelector(`#${inputId} sl-button[name="run"]`).loading = false
  document.querySelectorAll(`#${inputId} sl-checkbox`).forEach(checkbox => {
    checkbox.disabled = false
  })
  document.querySelectorAll(`#${inputId} sl-input`).forEach(input => {
    input.disabled = false
  })
}
