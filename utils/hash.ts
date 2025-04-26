export function hashString(str: string): number {
    let hash = 0
    if (str.length === 0) return hash
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return hash
}

export function calculateArrayHash<T extends { id: string }>(data: T[]): number {
    const sortedData = [...data].sort((a, b) => a.id.localeCompare(b.id))
    return hashString(JSON.stringify(sortedData))
}