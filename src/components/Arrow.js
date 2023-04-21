export const Arrow = ({deg}) => (
    <div className='arrow'>
        <svg style={{transform: `rotate(${deg}deg)`}} fill='none' width="40" height="40" viewBox='0 0 60 60'>
            <path d='M5,30 L55,30 M40,15 L55,30 L40,45' strokeWidth='2px' stroke='white' strokeLinecap="round"/>
        </svg>
    </div>
)

