export const readStorage = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch (err) {
        console.error(`Storage read failed for ${key}`, err)
        return fallback
    }
}

export const writeStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
        return true
    } catch (err) {
        console.error(`Storage write failed for ${key}`, err)
        return false
    }
}
