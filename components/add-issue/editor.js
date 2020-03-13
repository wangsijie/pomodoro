import React, { useEffect } from 'react';
import ReactMde from "react-mde";
import * as Showdown from "showdown";

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

export default function Editor({ value, onChange }) {
    const [selectedTab, setSelectedTab] = React.useState('write');
    return <div className="ui-editor">
        <ReactMde
            value={value}
            onChange={onChange}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={markdown =>
                Promise.resolve(converter.makeHtml(markdown))
            }
        />
    </div>
}
