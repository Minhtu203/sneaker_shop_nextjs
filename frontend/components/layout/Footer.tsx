import React from 'react';

type FooterProps = {
  className?: string;
};

export default function Footer({ className, ...props }: FooterProps) {
  return (
    <div className={`${className} mt-20 flex flex-col`}>
      <i className="h-[0.1rem] bg-(--gray) rounded-4xl"></i>

      <div className="w-full pt-8 pb-15 px-4 grid grid-cols-4">
        <div className="flex flex-col items-start">
          <HeaderFooter>Resources</HeaderFooter>
          <div className="flex flex-col gap-3 justify-start items-start">
            <FooterItem>Find A Store</FooterItem>
            <FooterItem>Become A Member</FooterItem>
            <FooterItem>Send Us Feedback</FooterItem>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <HeaderFooter>Help</HeaderFooter>
          <div className="flex flex-col gap-3 justify-start items-start">
            <FooterItem>Get Help</FooterItem>
            <FooterItem>Order Status</FooterItem>
            <FooterItem>Delivery</FooterItem>
            <FooterItem>Returns</FooterItem>
            <FooterItem>Payment Options</FooterItem>
            <FooterItem>Contact us</FooterItem>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <HeaderFooter>Company</HeaderFooter>
          <div className="flex flex-col gap-3 justify-start items-start">
            <FooterItem>About us</FooterItem>
            <FooterItem>News</FooterItem>
            <FooterItem>Report a Concern</FooterItem>
          </div>
        </div>
      </div>
    </div>
  );
}

type HeaderFooterProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string;
};

const HeaderFooter = ({ className, ...props }: HeaderFooterProps) => {
  return (
    <span className={`${className} text-[1rem]  mb-4`} {...props}>
      {props.children}
    </span>
  );
};

type ItemFooterProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

const FooterItem = ({ className, ...props }: ItemFooterProps) => {
  return (
    <button
      className={`${className} cursor-pointer text-[0.9rem] text-gray-400`}
      {...props}
      onClick={() => console.log(props.children)}
    >
      {props.children}
    </button>
  );
};
