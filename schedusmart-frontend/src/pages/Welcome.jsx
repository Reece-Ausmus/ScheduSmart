import Header from '../components/Header'

export default function Welcome() {
    const handleButtonClick = () => {
        window.location.href = '/createaccount';
      };
    return(
        <>
        <Header/>
        <h2>Welcome!</h2>
        <button>Sign-in! This does nothing until sign-in is implemented</button>
        <button onClick={handleButtonClick}>Create an account!</button>
        </>
    );
}