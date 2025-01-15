export default function AuthCodeError() {
    const message = `Looks like something went wrong with your login. We're looking into it!`;
    return (
        <>
            <h1>Whoops!</h1>
            <p>{message}</p>
        </>
    );
}
