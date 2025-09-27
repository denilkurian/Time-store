import React, { useState } from "react";

type TabProps = {
  
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  className?:string;
  children: React.ReactNode;
};

const Tab: React.FC<TabProps> = ({ content }) => {
  return <div className="tab-content">{content}</div>;
};

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const labels = React.Children.map(children, (child, index) => {
    if (React.isValidElement<TabProps>(child)) {
      return (
        <button
          className={`relative px-6 py-3 text-lg font-semibold transition-all duration-300 ease-in-out ${
            index === activeTab
              ? "text-blue-600 border-b-4 border-blue-600" // Active tab text in blue
              : "text-gray-600 hover:text-blue-500 dark:text-gray-300 hover:dark:text-blue-400" // Inactive tab text in gray
          } focus:outline-none`}
          onClick={() => handleTabClick(index)}
        >
          {child.props.label}
        </button>
      );
    }
    return null;
  });

  const content = React.Children.map(children, (child, index) => {
    if (React.isValidElement<TabProps>(child) && index === activeTab) {
      return (
        <div className=" bg-white dark:bg-gray-800 rounded-lg">
          {child.props.content}
        </div>
      );
    }
    return null;
  });

  return (
    <div className="tabs">
      <div className="flex space-x-6 mb-4 border-b border-gray-200 dark:border-gray-700 ">
        {labels}
      </div>
      <div>{content}</div>
    </div>
  );
};

export default Tabs;
export { Tab };
