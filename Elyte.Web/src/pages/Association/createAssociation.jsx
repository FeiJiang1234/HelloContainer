import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { ElButton, ElInput, ElTitle, ElSelect, ElImageSelecter, ElDialog, ElAvatar, ElBox, ElFileUploader } from 'components';
import { useForm } from "react-hook-form";
import { utils, validator, useOfficialIds, useFormValidate, useFile } from 'utils';
import { associationService, authService } from 'services';
import { useHistory, useLocation } from 'react-router-dom';
import { FileUploadType } from 'enums';
import { RegionCascader } from 'pageComponents';

export default function Association () {
    const user = authService.getCurrentUser();
    const history = useHistory();
    const location = useLocation();
    const routerParams = location.state?.params;
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { validateDigital, validateEmail } = useFormValidate();
    const { officialIds } = useOfficialIds(user.id);
    const { setFiles, setFormDataFiles, isFileOverSize } = useFile();
    const [hideCreateAssociation, setHideCreateAssociation] = useState(false);
    const [isOfficial, setIsOfficial] = useState(false);
    const [image, setImage] = useState();
    const [showCongratulationsDialog, setShowCongratulationsDialog] = useState(false);
    const [associationId, setAssociationId] = useState();
    const [associationData, setAssociationData] = useState([]);
    const [url, setUrl] = useState();


    useEffect(() => {
        if (associationData?.image) {
            utils.readFile(associationData.image).then(d => {
                setUrl(d);
            });
        }
    }, [associationData]);

    const buildPageTitle = () => {
        if (!hideCreateAssociation) return "Create An Association";

        return isOfficial ? "Official Association Details" : "Unofficial Association Details";
    }

    const handleClick = async (data) => {
        if (!hideCreateAssociation) {
            setHideCreateAssociation(true);
        }
        if (hideCreateAssociation) {
            const formData = utils.formToFormData(data);
            formData.append('file', image || routerParams?.image);
            setFormDataFiles(formData);

            const res = await associationService.createAssociation(formData);
            if (res && res.code === 200 && res.value) {
                setAssociationId(res.value);
                data['id'] = res.value;
                setAssociationData({ image: image || routerParams?.image, ...data });
                setShowCongratulationsDialog(true);
            }
        }
    }

    const handleGoToProfile = () => {
        history.push('/associationProfile', { params: associationId });
    };

    return (
        <form onSubmit={handleSubmit(handleClick)} autoComplete="off">
            <ElTitle center>{buildPageTitle()}</ElTitle>
            <Typography className="category-text">Main information</Typography>
            <ElImageSelecter name="image" label="Choose profile image" defaultValue={routerParams?.image} onImageSelected={(i) => setImage(i)} />
            <ElInput label="Name your Association" errors={errors} inputProps={{ maxLength: 50 }} defaultValue={routerParams?.organizationName}
                {...register("name", { required: 'This field is required.' })}
            />
            <Box className={hideCreateAssociation ? 'el-hide' : ''}>
                <ElSelect label="Official Id (Optional)" options={officialIds} errors={errors}
                    {...register("officialId", { onChange: e => setIsOfficial(e.target.value != '') })}
                />

                <ElInput label="Details" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }} defaultValue={routerParams?.organizationBio}
                    {...register("details", {
                        required: 'This field is required.'
                    })}
                />
                <RegionCascader register={register} errors={errors} />
                <ElButton mt={6} type="submit">Next Step</ElButton>
            </Box>
            {
                hideCreateAssociation &&
                <Box className={hideCreateAssociation ? '' : 'el-hide'}>
                    {
                        isOfficial &&
                        <>
                            <Typography className="category-text">Payment Details</Typography>
                            <ElInput label="Price to Register ($)" errors={errors} inputProps={{ maxLength: 10 }}
                                {...register("registerPrice", {
                                    required: 'This field is required.',
                                    validate: {
                                        rule1: v => validator.isNonzeroDecimal(v, 2) || 'Please enter correct price!'
                                    }
                                })}
                            />
                            <ElInput label="Payment Account" errors={errors} inputProps={{ maxLength: 100 }}
                                {...register("paymentAccount", {
                                    required: 'This field is required.',
                                })}
                            />
                        </>
                    }
                    <Typography className="category-text">File to Upload</Typography>
                    <ElFileUploader label="Upload Terms and Conditions*" type={FileUploadType.TermsAndConditions} onRegister={register} onSetFiles={setFiles} />
                    <ElFileUploader label="Upload Waiver Doc*" type={FileUploadType.WaiverDoc} onRegister={register} onSetFiles={setFiles} />
                    <ElFileUploader label="COVID 19 Waiver" type={FileUploadType.COVID19Waiver} onRegister={register} onSetFiles={setFiles} />
                    <ElFileUploader label="Additional Documents" type={FileUploadType.AdditionalDoc} onRegister={register} onSetFiles={setFiles} />
                    <Typography className="category-text">Contact Details</Typography>
                    <ElInput label="Association Contact Number" errors={errors} inputProps={{ maxLength: 15 }}
                        {...register("contactNumber", {
                            required: 'This field is required.',
                            validate: { rule1: v => validateDigital(v) }
                        })}
                    />
                    <ElInput label="Association Contact Email" errors={errors}
                        {...register("contactEmail", {
                            required: 'This field is required.',
                            validate: { rule1: v => validateEmail(v) }
                        })}
                    />
                    <ElButton mt={6} disabled={isFileOverSize()} type="submit">Create Association</ElButton>
                </Box>
            }
            <ElDialog
                maxWidth={"xs"}
                open={showCongratulationsDialog}
                title="Congratulations"
                subTitle="You have successfully created a new association!"
                actions={<ElButton onClick={handleGoToProfile}>Go to Profile</ElButton>}>
                <ElBox center mb={2} sx={{ display: 'flex', flexDirection: 'row' }}>
                    <ElAvatar src={url} />
                    <Typography sx={{ overflowWrap: "anywhere" }}>{associationData.name}</Typography>
                </ElBox>
                <ElBox sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Typography sx={{ color: '#17C476' }} mr={1} >Details:</Typography>
                    <Typography sx={{ overflowWrap: "anywhere" }}>{associationData.details}</Typography>
                </ElBox>
            </ElDialog>
        </form>
    )
}