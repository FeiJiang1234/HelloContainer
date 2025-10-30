import React, { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Container, Grid, Box, MobileStepper } from '@mui/material';
import { ElButton, ElTitle, ElBody } from 'components';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex !important',
        flexDirection: 'column',
        height: '100%',
        padding: 0,
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(8),
        position: 'relative'
    },
    title: {
        color: '#20345D',
        textTransform: 'uppercase'
    },
    subTitle: {
        color: '#20345D'
    },
    image: props => ({
        backgroundImage: `url(/svgs/${props.image}.svg)`,
        flex: 1,
        minHeight: 322,
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat'
    }),
    text: {
        whiteSpace: 'pre-wrap',
        marginBottom: theme.spacing(2)
    },
    step: {
        justifyContent: 'center !important',
        position: 'absolute',
        bottom: theme.spacing(2),
        width: '100%'
    }
}));

const WelcomeLayout = ({ children, data }) => {
    const totalStep = data.length;
    const history = useHistory();
    const [step, setStep] = useState(0);
    const classes = useStyles({ image: data[step].image });

    const handleNext = () => {
        const nextStep = step + 1;
        if (nextStep === totalStep) {
            history.push('/');
        } else {
            setStep(nextStep);
        }
    };

    return (
        <Container maxWidth="xs" className={classes.root}>
            <ElTitle className={classes.title} large>{data[step].title}</ElTitle>
            <ElTitle className={classes.subTitle} sub>{data[step].subTitle}</ElTitle>
            <Box className={classes.image}></Box>
            <Box pl={2} pr={2}>
                <ElBody className={classes.text} center>{data[step].content}</ElBody>
                {children}
                {
                    totalStep > 1 && <Grid container>
                        <Grid xs={6} item>
                            {step + 1 < totalStep && (
                                <ElButton mr={1} variant="outlined" component={RouterLink} to="/">
                                    Skip
                                </ElButton>
                            )}
                        </Grid>
                        <Grid xs={6} item>
                            <ElButton ml={1} onClick={handleNext}>Next</ElButton>
                        </Grid>
                    </Grid>
                }
            </Box>
            {
                totalStep > 1 && <MobileStepper
                    variant="dots"
                    steps={totalStep}
                    position="static"
                    activeStep={step}
                    className={classes.step}
                />
            }
        </Container>
    );
};

export default WelcomeLayout;
