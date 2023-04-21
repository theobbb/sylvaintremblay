import Rep from './Rep'

const Reps = ({ reps, open }) => {
    return (
        
        <div id='reps'>
            {reps.map((rep) => (
                <Rep 
                    key={rep.id} 
                    rep={rep} 
                    open={open}
                />
            ))} 
            
        </div>
    )
}

export default Reps