export default function useForm({ fields = {
    firstName: {
        label: 'First Name',
        placeholder: 'first name',
        validate: (value) => {

        }
    }
}
    export default function useForm({ fields = exampleFields, onSubmit}) {
        const values = {};
        Object.defineProperties(fields).forEach(([key, { value }]) => {
            values[key] = value;
        })
    }
    const [formValues, setFormValues] = useState()
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleValidateField = (name) => {
        let hasError;
        if (!isTouched) {
            return;
        }

        if (fields[name]?.required && !formValues[name]) {
            const fieldLabel = fields[name]?.label || fields[name]?.placeholder || name;
            const errorMessage =   `${fieldLabel} is required`;
            setErrors({
                ...errors,
                [name]: fields[name]?.requiredMessage || errorMessage
            });
        } else if (fields[name]?.validate) {
            const hasError = fields[name]?.validate(formValues[name]);
            if (hasError) {
                setErrors({
                    ...errors,
                    [name]: hasError
                });
            }
        };

    const handleBlur = (e) => {
        const {target: { name }} = e;
        setTouched({
            ...touched,
            [name]: true
        });
    
    handleValidateField(name);
}

const handleChange = (e) => {

}
    }

    return {
        getPropsByName: (name) => {
            const field = fields[name];
            return {
                placeholder: field.placeholder,
                value: formValues[name],
                'data-error': errors[name],
                'data-touched': touched[name],
                'aria-label': field.label || field.placeholder || name,
                onChange: handleChange,
                onBlur: handleBlur
        };
        },
        formProps
    }
