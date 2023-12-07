import type { Config } from '@master/css'

export default {
    styles: {},
    rules: {},
    variables: {},
    semantics: {},
    mediaQueries: {},
    animations: {
        'transition-down': {
            from: {
                opacity: '0',
                translate: '0rem -1rem',
                'pointer-events': 'none'
            },
            to: {
                opacity: '1',
                translate: '0',
                'pointer-events': 'auto'
            }
        }
    },
    selectors: {},
    functions: {}
} as Config
