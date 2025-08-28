import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Table } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../api/axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminSavingsAnalytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data } = await api.get('/savings/analytics/admin');
      setAnalytics(data);
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <p>Loading...</p>;

  return (
    <Container>
      <h2 className="my-4">Admin Savings Analytics</h2>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Overall Savings</Card.Title>
              <p>Total Amount: {analytics.overall.totalAmount}</p>
              <p>Total Deposits: {analytics.overall.count}</p>
              <p>Average per Deposit: {analytics.overall.avgAmount}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Monthly Trends</Card.Title>
              <LineChart width={700} height={300} data={analytics.monthly}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" />
              </LineChart>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Payment Methods</Card.Title>
              <PieChart width={250} height={250}>
                <Pie
                  data={analytics.methods}
                  dataKey="totalAmount"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {analytics.methods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Per Member Summary</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Total Amount</th>
                    <th>Deposits</th>
                    <th>Average Deposit</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.perMember.map(member => (
                    <tr key={member.memberId}>
                      <td>{member.memberName}</td>
                      <td>{member.memberEmail}</td>
                      <td>{member.totalAmount}</td>
                      <td>{member.count}</td>
                      <td>{member.avgAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
