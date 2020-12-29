import React from 'react';

import { BrowserRouter, Link, Switch, Route, Redirect } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { SET_USER } from './userReducer';

import './App.css';
import redGoldWrapper from './assets/Gold_Red_Wrap_100x200pt.svg';
import backgroundImage from './assets/Main Background.svg';

const useUser = () => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const setUser = payload => {
        dispatch({ type: SET_USER, payload });
    };

    return [ user, setUser ];
};

export function EntryPage() {
    const [ user, setUser ] = useUser();

    const [ loginEmail, setLoginEmail ] = React.useState('');
    const [ loginPassword, setLoginPassword ] = React.useState('');
    const [ signUpEmail, setSignUpEmail ] = React.useState('');
    const [ signUpPassword, setSignUpPassword ] = React.useState('');
    const [ signUpConfirmPassword, setSignUpConfirmPassword ] = React.useState('');

    const [ redirect, setRedirect ] = React.useState(null);

    const goToMainPage = () => {
        setRedirect(<Redirect to="/gifts" />);
    };

    const attemptLogin = (email, password) => {
        firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(response => {
                    let payload = {
                        email: response.user.email,
                        uid: response.user.uid,
                    };
                    setUser(payload);
                    goToMainPage();
                })
                .catch(err => {
                });
    };

    const attemptSignUp = (email, password, confirmPassword) => {
        if (password !== confirmPassword) {
            return;
        }

        firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(response => {
                    user = response.user;
                    goToMainPage();
                })
                .catch(err => {
                    console.dir(err);
                });

        // console.log(`Username: ${email}\nPassword: ${password}\nConfirm Password: ${confirmPassword}`);
    };

    return (
        <div className="entry-page">
            {redirect}

            <div className="login">
                <h1>Login</h1>
                <input type="email" placeholder="Email" onChange={e => setLoginEmail(e.target.value)} value={loginEmail} />
                <input type="password" placeholder="Password" onChange={e => setLoginPassword(e.target.value)} value={loginPassword} />
                <input type="button" value="OK" onClick={() => attemptLogin(loginEmail, loginPassword)} />
                <img className="login-background" src={redGoldWrapper} />
            </div>

            <div className="sign-up">
                <h1>Sign Up</h1>
                <input type="text" placeholder="Email" onChange={e => setSignUpEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={e => setSignUpPassword(e.target.value)} />
                <input type="password" placeholder="Confirm Password" onChange={e => setSignUpConfirmPassword(e.target.value)} />
                <input type="button" value="OK" onClick={() => attemptSignUp(signUpEmail, signUpPassword, signUpConfirmPassword)} />
                <img className="login-background" src={redGoldWrapper} />
            </div>
            <img className="entry-background" src={backgroundImage} />
        </div>
    );
}

export function GiftsPage() {
    const [ user, setUser ] = useUser();
    const [ error, setError ] = React.useState(null);
    const [ gifts, setGifts ] = React.useState([]);

    React.useEffect(() => {
        firebase
                .firestore()
                .collection("gifts")
                .where("userUid", "==", user.uid)
                .get()
                .then(query => {
                    let tempGifts = [];
                    query.forEach(doc => {
                        let gift = doc.data();
                        tempGifts.push(gift);
                    });
                    setGifts(tempGifts);
                })
                .catch(setError);
    }, [ user.uid ]);

    if (error) {
        return (
            <p>error</p>
        );
    } else {
        const renderedGifts = gifts.map(gift => {
            let numDollars = Math.floor(gift.priceCents / 100);
            let numCents = ('' + (100 + gift.priceCents % 100)).substr(1);
            let priceDollars = numDollars + '.' + numCents;
            return (
                <li key={gift.uid}>
                    <p className="recipient">{gift.recipient}</p>
                    <p className="description">{gift.description}</p>
                    <p className="price">{priceDollars}</p>
                </li>
            );
        });

        return (
            <div className="gifts-page">
                <Link to="/gifts/new"><button className="new-gift">New...</button></Link>
                <ul className="gifts-list">
                    {renderedGifts}
                </ul>
                <img className="entry-background" src={backgroundImage} />
            </div>
        );
    }
}

export function NewGiftsPage(props) {
    const [ user, setUser ] = useUser();
    const [ recipient, setRecipient ] = React.useState('');
    const [ description, setDescription ] = React.useState('');
    const [ priceCents, setPriceCents ] = React.useState('');
    const [ redirect, setRedirect ] = React.useState(null);

    const submitNewGift = e => {
        e.preventDefault();
        firebase
                .firestore()
                .collection('gifts')
                .add({
                    recipient,
                    description,
                    priceCents,
                    userUid: user.uid
                })
                .then(docRef => {
                    let id = docRef.id;
                    console.log(`Gift Created!:`);
                    console.log(`ID: ${id}`);

                    setRedirect(<Redirect to='/gifts' />);
                })
                .catch(err => {
                    console.error('ERROR WITH FIREBASE!');
                    console.error(err);
                });
    };

    return (
    <>
        <Link to="/gifts" className="gifts-link"><button className="back-button">Back</button></Link>
        <div className="new-gift-page">
        <h1>New Gift</h1>
        <form onSubmit={submitNewGift}>
            <input type="text" name="recipient" placeholder="Recipient" value={recipient} onChange={e => setRecipient(e.target.value)} required />
            <input type="text" name="description" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
            <input type="number" name="price-cents" step="1" placeholder="Price in Cents" value={priceCents} onChange={e => setPriceCents(e.target.value)} required />
            <input type="submit" value="OK" />
        </form>
        <img className="login-background" src={redGoldWrapper} />

        {redirect}

        </div>
        <img className="entry-background" src={backgroundImage} />
    </>
    );
}

export function Logout() {
    const [ user, setUser ] = useUser();
    const [ redirect, setRedirect ] = React.useState(null);

    React.useEffect(() => {
        setUser(null);
        setRedirect(<Redirect to="/login" />);
    }, []);

    return redirect;
}

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" exact><EntryPage /></Route>
                <Route path="/logout" exact><Logout /></Route>
                <Route path="/gifts" exact><GiftsPage /></Route>
                <Route path="/gifts/new" exact><NewGiftsPage /></Route>
                <Route path="*"><Redirect to="/login" /></Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;

