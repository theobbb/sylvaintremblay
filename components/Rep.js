const Rep = ({ rep, open }) => {

    return (
        <div className='rep'>
            <button className={'level-'+ rep.level} onClick={() => open(rep.id)}>{rep.name}</button>
        </div>
    )
}
//<button onClick={() => onDelete(rep.id)}>X</button>
export default Rep
