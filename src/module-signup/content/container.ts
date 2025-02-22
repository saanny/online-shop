import { useFormik } from "formik";
import { IFormModel, IModel } from "./model";
import *as yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { route_names } from "../../Routes/route-names";
import { toast } from "react-toastify";

export const useContainer = (): IFormModel => {

    const navigator = useNavigate()
    const app_routes = route_names();

    const initial_values = {
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    } as IModel;

    const validation_schema = yup.object().shape({
        email: yup.string().required("This field is required"),
        password: yup.string().min(8).required("This field is required"),
        first_name: yup.string().required("This field is required"),
        last_name: yup.string().notRequired()
    });

    const action_submit = (values: IModel) => {

        axios({
            method: "Post",
            url: `${process.env.REACT_APP_API_URL}/auth/register`,
            responseType: "json",
            data: {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                password: values.password
            } as IModel
        })
            .then((response) => {
                navigator(app_routes.signin_path)
            })
            .catch((response)=>{
                toast.error('Already Signed Up', {
                    position: toast.POSITION.TOP_RIGHT
                });
            })

    }

    const formik = useFormik({
        initialValues: initial_values,
        validationSchema: validation_schema,
        onSubmit: action_submit
    });

    return {
        action_submit: formik.handleSubmit,
        form_data: formik.values,
        form_errors: formik.errors,
        handleChange: formik.handleChange
    }
}