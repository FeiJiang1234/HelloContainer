import React, { Suspense, useEffect, useReducer, useState, useRef } from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ElLoadingMask, ProtectedRoute } from 'components';
import { AlarmClock } from 'pageComponents';
import { Layout } from 'parts';
import { utils, useInitialization } from 'utils';
import { appStates, appReducer } from './store/reducers/app.reducer';
import { authService, athleteService } from 'services';
import * as moment from 'moment';
import store from 'store/store';
import TermsOfRegister from 'pages/Terms/termsOfRegister';
import TermsOfPrivacyPolicy from 'pages/Terms/termsOfPrivacyPolicy';
import Register from 'pages/User/register';
import Login from 'pages/User/login';
import ContactUs from 'pages/ContactUs/contactUs';
import PasswordReset from 'pages/User/PasswordReset/passwordReset';
import VerificationCode from 'pages/User/PasswordReset/verificationCode';
import OneTimePassCode from 'pages/User/PasswordReset/oneTimePassCode';
import EnterNewPass from 'pages/User/PasswordReset/enterNewPass';
import Startup from 'pages/Startup/startup';
import Welcome from 'pages/Welcome/welcome';
import NotFoundPage from 'pages/Home/notFoundPage';
import TermsOfFacility from 'pages/Terms/termsOfFacility';


export const AppContext = React.createContext(null);
function App () {
    const ref = useRef([]);
    const timerRef = useRef();
    const { routers } = useInitialization();
    const [state, dispatch] = useReducer(appReducer, appStates);
    const [alarmQueue, setAlarmQueue] = useState([]);

    useEffect(async () => {
        ref.current = [];
        setAlarmQueue([]);
        const reminderItems = await getCurrentUserEventAndReminders();

        if (reminderItems !== null && Array.isArray(reminderItems)) {
            const events = reminderItems?.filter((x) => x.type === "Event");
            const reminders = reminderItems?.filter((x) => x.type === "Reminder");
            if (events.length <= 0 && reminders.length <= 0) return;
            if (timerRef.current) clearInterval(timerRef.current);
            buildInterval(events, reminders);
        }
    }, [state.refreshAlarmQueue]);

    const buildInterval = (events, reminders) => {
        timerRef.current = setInterval(() => {
            let queue = [];
            for (const event of events) {
                let reminderTime = new Date(event.reminderTime);
                reminderTime.setMinutes(reminderTime.getMinutes() - event.alertTime);
                if (moment(new Date()).isSame(reminderTime, 'minute')) {
                    queue.push({ id: event.id, title: event.title, type: event.type, startTime: event.reminderTime });
                }
            }

            for (const reminder of reminders) {
                let reminderTime = new Date(reminder.reminderTime);
                if (moment(new Date()).isSame(reminderTime, 'minute')) {
                    queue.push({ id: reminder.id, title: reminder.title, type: reminder.type, startTime: '' });
                }
            }

            if (queue.length <= 0) return;
            const isAllExist = ref.current.some(x => queue.some(y => y.id === x.id));
            if (isAllExist) return;
            ref.current = queue;

            setAlarmQueue([...ref.current]);
        }, 2000);
    }

    const getCurrentUserEventAndReminders = async () => {
        const loginUser = authService.getCurrentUser();
        if (!loginUser) return;
        const res = await athleteService.getTodayEventReminders(loginUser?.id || 0);
        if (res && res.code === 200 && Array.isArray(res.value)) {
            return res.value;
        }

        return null;
    }

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <Provider store={store}>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/startup" component={Startup} />
                    <Route path="/contactUs" component={ContactUs} />
                    <Route path="/passwordReset" component={PasswordReset} />
                    <Route path="/verification" component={VerificationCode} />
                    <Route path="/oneTimePassCode" component={OneTimePassCode} />
                    <Route path="/enterNewPass" component={EnterNewPass} />
                    <Route path="/termsOfRegister" component={TermsOfRegister} />
                    <Route path="/termsOfPrivacyPolicy" component={TermsOfPrivacyPolicy} />
                    <Route path="/termsOfFacility" component={TermsOfFacility} />
                    <Route path="/welcome" component={Welcome} />
                    <Route path="/404" component={NotFoundPage} />
                    <Layout>
                        <ProtectedRoute render={() => (
                            <Suspense fallback={<ElLoadingMask isLazyLoad={false} />}>
                                <Switch>
                                    {
                                        routers.map((item) => (
                                            !item.IsRedirect ?
                                                <Route key={utils.generateUUID()} path={item.routePath} component={item.component} exact /> :
                                                <Redirect key={utils.generateUUID()} path={item.routePath} to={item.RedirectTo} />
                                        ))
                                    }
                                </Switch>
                            </Suspense>
                        )} />
                    </Layout>
                </Switch>
            </Provider>
            {
                Array.isArray(alarmQueue) && alarmQueue.map((queue, index) => {
                    return (<AlarmClock key={`alarm-reminder-${queue.id}-index=${index}`} reminderItem={queue}></AlarmClock>)
                })
            }
        </AppContext.Provider >
    );
}

export default App;
