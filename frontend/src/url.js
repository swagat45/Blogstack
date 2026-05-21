const DEFAULT_API_URL="http://127.0.0.1:5000"

export const URL=import.meta.env.VITE_URL || DEFAULT_API_URL
export const IF=import.meta.env.VITE_IF || `${URL}/images/`
