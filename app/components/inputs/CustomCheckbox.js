"use client";

const CustomCheckbox = ({id, label, disabled, register}) => {
    return ( 
        <div className="w-full flex flex-row gap-2 items-center">
            <input type="checkbox" id={id} disabled={disabled} {...register(id)} placeholder="" className="cursor-pointer" />

            <label htmlFor={id} className="font-medium cursor-pointer">{label}</label>
        </div>
     );
}
 
export default CustomCheckbox;