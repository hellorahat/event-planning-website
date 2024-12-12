import AccountMenu from "../components/AccountMenu";

function Login() {
    return <DesktopLayout />
}

function DesktopLayout() {
  return (
    <>
      <div className="menu-holder">
          <AccountMenu />
      </div>
    </>
  );
}

export default Login;
