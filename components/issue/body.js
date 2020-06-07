import React, { useEffect } from 'react';
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import './style.less';
import { Button } from 'antd';

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

export default function IssueBody({ issue, updateIssue }) {
    const [value, setValue] = React.useState('');
    const [selectedTab, setSelectedTab] = React.useState('write');
    useEffect(() => {
        setValue(issue.content);
    }, [issue.content])
    const onSave = () => updateIssue(issue.id, { content: value });
    return <div className="ui-issue-body">
        <ReactMde
            value={value}
            onChange={setValue}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={markdown =>
                Promise.resolve(converter.makeHtml(markdown))
            }
        />
        <Button type="primary" className="save-button" onClick={onSave}>保存</Button>
    </div>
}
