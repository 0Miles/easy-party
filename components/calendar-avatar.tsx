'use client'

/* eslint-disable @next/next/no-img-element */
import * as Tooltip from '@radix-ui/react-tooltip'

export default function CalendarAvatar({ className, displayName, src }: any) {
    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <img className={`${className ?? ''} @transition-up|.2s`} src={src ?? ''} alt={displayName ?? ''} />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content className="r:3 p:8|16 f:16 bg:gray-20 bg:gray-95@light box-shadow:0|0|5|black/.5 box-shadow:0|0|5|gray-80/.5@light @transition-up|.2s" sideOffset={5}>
                        {displayName ?? ''}
                        <Tooltip.Arrow className="fill:gray-20 fill:gray-95@light" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    )
}