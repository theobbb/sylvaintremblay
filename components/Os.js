import O from './O'

const Os = ({ os }) => {
    return (
        <>
            
            {os.map((o) => (
                <O key={o.id} o={o} />
            ))}
            
        </>
    )
    
}
export default Os
