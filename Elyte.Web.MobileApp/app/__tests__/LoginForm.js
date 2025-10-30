import { fireEvent, waitFor } from '@testing-library/react-native';
import LoginForm from '../screen/login/components/LoginForm';
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';

const renderRoot = ui => {
    const inset = {
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
    };
    return render(
        <NativeBaseProvider initialWindowMetrics={inset}>
            <NavigationContainer>{ui}</NavigationContainer>
        </NativeBaseProvider>,
    );
};

test('render login form snapshot', () => {
    // Arrange
    const handleSubmit = jest.fn();
    const login = renderRoot(<LoginForm onSubmit={handleSubmit} />);

    // Assert
    expect(login).toMatchSnapshot();
});

test('test login validate email and password required', async () => {
    // Arrange
    const handleSubmit = jest.fn();

    const { getByText } = renderRoot(<LoginForm onSubmit={handleSubmit} />);

    // Act
    fireEvent.press(getByText('Sign in'));

    // Assert
    await waitFor(() => {
        expect(getByText('Please enter your account.'));
        expect(
            getByText(
                'Password length betweent 8 and 18, include alphanumeric and start with letter',
            ),
        );
    });
});

test('test login validate password length', async () => {
    // Arrange
    const handleSubmit = jest.fn();

    const { getByTestId, getByText } = renderRoot(<LoginForm onSubmit={handleSubmit} />);

    // Act
    const password = getByTestId('password');
    fireEvent.changeText(password, '1234');
    fireEvent.press(getByText('Sign in'));

    // Assert
    await waitFor(() => {
        expect(
            getByText(
                'Password length betweent 8 and 18, include alphanumeric and start with letter',
            ),
        );
    });
});

test('test login call submit with user data', async () => {
    // Arrange
    const fakeUser = { account: 'fred@elyte.com', password: 'aa1234567' };
    const handleSubmit = jest.fn();

    const { getByTestId, getByText } = renderRoot(<LoginForm onSubmit={handleSubmit} />);

    // Act
    fireEvent.changeText(getByTestId('account'), fakeUser.account);
    fireEvent.changeText(getByTestId('password'), fakeUser.password);
    const submitBtn = getByText('Sign in');
    fireEvent.press(submitBtn);

    // Assert
    await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(handleSubmit).toHaveBeenCalledWith(fakeUser);
    });
});
