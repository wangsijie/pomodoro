import { Card, Progress, Button, Collapse, Spin, Badge } from "antd";
import { ReloadOutlined } from '@ant-design/icons';
import moment from "moment";
import axios from 'axios';
import nextCookie from 'next-cookies'
import Layout from "../components/layout";
import Login from "../components/login";
import { getIssues, getCategories } from '../helper/db';
import './index.less';
import { useState, useEffect, useCallback } from "react";
import AddIssue from "../components/add-issue";
import IssueTitle from "../components/issue/title";
import IssueBody from "../components/issue/body";
import { getInfo } from "../helper/token";
import UserInfo from "../components/user-info";
import Categories from "../components/categories";

const weekDays = [
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六',
  '周日',
];

function Home({ issues: initialIssues, user, categories: initialCategories }) {
  const [issues, setIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setIssues(initialIssues);
  }, [initialIssues]);
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const updateIssue = (createdAt, data) => {
    setIssues(prevIssues => prevIssues.map(issue => {
      if (issue.createdAt !== createdAt) {
        return issue;
      }
      // axios.patch(
      axios.post(
        process.env.API_ROOT + '/api/issues/' + issue._id,
        data,
      );
      return {
        ...issue,
        ...data,
      }
    }))
  };

  const reload = useCallback(async () => {
    setLoading(true);
    const res = await axios.get(process.env.API_ROOT + '/api/issues');
    setLoading(false);
    setIssues(res.data);
  }, []);

  const weekItems = categories.map(category => {
    const required = category.targets.reduce((p, v) => p + v, 0);
    const finished = issues.filter(issue => issue.category === category.key).length;
    const percent = finished < required ? Math.floor(finished / required * 100) : 100;
    return {
      name: category.title,
      category,
      required,
      finished,
      percent,
    }
  });
  const weekFinished = weekItems.reduce((p, item) => p + item.finished, 0);
  const weekRequired = weekItems.reduce((p, item) => p + item.required, 0);
  const weekPercent = Math.floor(weekFinished / weekRequired * 100);

  const today = (moment().day() + 6) % 7 + 1;
  const days = [];
  for (let i = today; i > 0; i--) {
    const finishedIssues = issues
        .filter(issue => {
          const day = (moment(issue.createdAt).day() + 6) % 7 + 1;
          return day === i;
        });
    const items = categories.map(category => {
      const required = category.targets[i - 1];
      const finished = finishedIssues
        .filter(issue => issue.category === category.key).length;
      const percent = finished < required ? Math.floor(finished / required * 100) : 100;
      return {
        name: category.title,
        category,
        required,
        finished,
        percent,
      }
    });
    const finished = items.reduce((p, item) => p + item.finished, 0);
    const required = items.reduce((p, item) => p + item.required, 0);
    days.push({
      name: weekDays[i - 1],
      items,
      issues: finishedIssues,
      finished,
      required,
      percent: finished < required ? Math.floor(finished / required * 100) : 100,
    })
  }

  if (!user) {
    return <Login />
  }

  return <Layout className="page-index">
    <Spin spinning={loading}>
      <div className="buttons">
        <AddIssue onAdded={reload} categories={categories} />
        <Button onClick={reload} icon={<ReloadOutlined />}></Button>
        <div className="space" />
        <Categories categories={categories} onChange={setCategories} />
        <UserInfo user={user} />
      </div>
      <Card title={<div className="job-item">
        <div className="name">本周</div>
        <div className="progress-text">
          {weekFinished} / {weekRequired}
        </div>
        <div className="progress">
          <Progress percent={weekPercent} />
        </div>
      </div>}>
        {weekItems.map(item => <div className="job-item" key={item.name}>
          <div className="name">
            <Badge count={item.category.title} style={{ backgroundColor: item.category.color, color: item.category.fontColor }} />
          </div>
          <div className="progress-text">
            {item.finished} / {item.required}
          </div>
          <div className="progress">
            <Progress percent={item.percent} />
          </div>
        </div>)}
      </Card>
      {days.map(day => <Card
        title={<div className="job-item">
          <div className="name">{day.name}</div>
          <div className="progress-text">
            {day.finished} / {day.required}
          </div>
          <div className="progress">
            <Progress percent={day.percent} />
          </div>
        </div>}
        key={day.name}
        style={{ marginTop: '10px' }}
      >
        {day.items.map(item => <div className="job-item" key={item.name}>
          <div className="name">
            <Badge count={item.category.title} style={{ backgroundColor: item.category.color, color: item.category.fontColor }} />
          </div>
          <div className="progress-text">
            {item.finished} / {item.required}
          </div>
          <div className="progress">
            <Progress percent={item.percent} />
          </div>
        </div>)}
        <Collapse className="issue-list">
          {day.issues.map((issue, index) => <Collapse.Panel
            key={issue.createdAt}
            header={<IssueTitle
              number={day.issues.length - index}
              issue={issue}
              onDeleted={reload}
              categories={categories}
            />}
          >
            <IssueBody issue={issue} updateIssue={updateIssue} />
          </Collapse.Panel>)}
        </Collapse>
      </Card>)}
    </Spin>
  </Layout>
}

Home.getInitialProps = async (ctx) => {
  const { token } = nextCookie(ctx);
  const user = await getInfo(token);
  const issues = user ? await getIssues({ userId: user.id }) : [];
  const categories = user ? await getCategories({ userId: user.id }) : [];
  return { issues, user, categories };
}

export default Home;
