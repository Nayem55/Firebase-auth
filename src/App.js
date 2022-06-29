import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "./firebase.init";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";

const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [register , setRegister] = useState(false)

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleName = (e) => {
    setName(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleCheck=e=>{
      setRegister(e.target.checked);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError("Password should contain atleast one special character");
      return;
    }

    setValidated(true);
    setError("");

    if(register){
      signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
    }

    else{
      createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        varifyEmail()
        setUserName()
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
    }
    
  };
  const setUserName =()=>{
    updateProfile(auth.currentUser, {
      displayName: name
    })
    .then(()=>{
      console.log('Updated Name');
    })
    .catch(error=>{
      setError(error.message)
    })
  }
  const varifyEmail=()=>{
    sendEmailVerification(auth.currentUser)
    .then(()=>{
      console.log("Email varification sent");
    })
  }

  const handlePasswordReset =()=>{
    sendPasswordResetEmail(auth, email)
    .then(()=>{
      console.log("Reset password email sent");
    })

  }

  return (
    <div>
      <div className="regester w-50 mx-auto mt-5 border p-5 ">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {!register && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onBlur={handleName}
              type="text"
              placeholder="Enter your name"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide your name.
            </Form.Control.Feedback>
          </Form.Group>}

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handleEmail}
              type="email"
              placeholder="Enter email"
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handlePassword}
              type="password"
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
            <Form.Group className="my-3 " controlId="formBasicCheckbox">
              <Form.Check onChange={handleCheck} type="checkbox" label="Already Registered?" />
            </Form.Group>
            <p className="text-danger">{error}</p>
          </Form.Group>
          <Button onClick={handlePasswordReset} variant="link">Forget Password?</Button>
          <Button variant="primary" type="submit">
            {register ? "Log in":"Register"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
