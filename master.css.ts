export default {
    styles: {},
    rules: {},
    variables: {},
    semantics: {},
    mediaQueries: {},
    animations: {
        'fade': {
            from: {
                opacity: 0
            },
            to: {
                opacity: 1
            }
        },
        'transition-down': {
            from: {
                opacity: 0,
                translate: '0rem -30%',
                'pointer-events': 'none'
            },
            to: {
                opacity: 1,
                translate: 0,
                'pointer-events': 'auto'
            }
        },
        'transition-up': {
            from: {
                opacity: 0,
                translate: '0rem 30%',
                'pointer-events': 'none'
            },
            to: {
                opacity: 1,
                translate: 0,
                'pointer-events': 'auto'
            }
        },
        'transition-left': {
            from: {
                opacity: 0,
                translate: '30% 0rem',
                'pointer-events': 'none'
            },
            to: {
                opacity: 1,
                translate: 0,
                'pointer-events': 'auto'
            }
        },
        'transition-right': {
            from: {
                opacity: 0,
                translate: '-30% 0',
                'pointer-events': 'none'
            },
            to: {
                opacity: 1,
                translate: 0,
                'pointer-events': 'auto'
            }
        }
    },
    selectors: {},
    functions: {}
} as any
