export function errorToast(message: string) {
  if (typeof window !== "undefined") {
    // minimal UI fallback for build/runtime
    // eslint-disable-next-line no-console
    console.error("errorToast:", message)
    try {
      // attempt to use browser alert as fallback
      // eslint-disable-next-line no-alert
      alert(message)
    } catch {}
  } else {
    // server-side fallback
    // eslint-disable-next-line no-console
    console.error(message)
  }
}
