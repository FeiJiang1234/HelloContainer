import React from 'react';
import { FormProvider } from "react-hook-form";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    root: (props) => ({
        display: 'flex',
        flexDirection: props.direction,
        width: '100%',
        flex: 1,
    })
}));

const ElForm = ({ form, onSubmit, flexDirection, children, ...rest }) => {
    const classes = useStyles({ direction: flexDirection ?? 'column' });
    return (
        <FormProvider {...form} >
            <form className={[classes.root, rest.className].join(' ')} noValidate autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
                {children}
            </form>
        </FormProvider>
    );
};

export default ElForm;
