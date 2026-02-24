export default function UserInfo(props){
    return (
        <>
        <h2>{props.name}</h2>
        <h4>{props.course}</h4>
        <p>{props.children}</p>
        </>
    )
}