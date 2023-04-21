
const Text = ({ o }) => {
    console.log(o);
    return (
        <div>
            <h3>{o.name}</h3>
            <p>{o.content}</p>
        </div>
    )
}

export default Text
