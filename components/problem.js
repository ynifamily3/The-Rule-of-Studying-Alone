import React from "react";
import "../css/problem.css";
import { Grid, Form, Radio, Image, Label, Segment } from "semantic-ui-react";

const Problem = () => (
  <div id="problem-page">
    <Grid rows={2}>
      <Grid.Row>
        <Segment raised>
          <Label as="a" color="black" ribbon>
            주제 - 소녀전선
          </Label>
          <div className="problem-title">
            다음 중 KSVK에 대한 설명으로 옳은 것을 고르시오.
            <Image
              src={
                "https://ww.namu.la/s/2c7a0bc93afd364d3c6190c5938cffe7e3b4fdd316907be68405ef06a2496c672b0e9e61c535a23d6061a50eafa0e3e9ffed821e4fd9aa719b2a07e7071ed0afd10e8c152fd1888241ebf333784c4c0e29aa6780e4e6a45c073dfc20653653bc"
              }
              size="small"
              floated="right"
            />
          </div>

          <Form>
            <Form.Field>
              <Radio label="너무너무 쎄다" />
            </Form.Field>
            <Form.Field>
              <Radio label="중증 츤데레다" />
            </Form.Field>
            <Form.Field>
              <Radio label="화력계 라이플이다" />
            </Form.Field>
            <Form.Field>
              <Radio label="화력은 SS다" />
            </Form.Field>
          </Form>
        </Segment>
      </Grid.Row>
      <Grid.Row>
        <Segment raised>
          <Label as="a" color="black" ribbon>
            주제 - 소녀전선
          </Label>
          <div className="problem-title">
            다음 중 KSVK에 대한 설명으로 옳은 것을 고르시오.
            <Image
              src={
                "https://ww.namu.la/s/2c7a0bc93afd364d3c6190c5938cffe7e3b4fdd316907be68405ef06a2496c672b0e9e61c535a23d6061a50eafa0e3e9ffed821e4fd9aa719b2a07e7071ed0afd10e8c152fd1888241ebf333784c4c0e29aa6780e4e6a45c073dfc20653653bc"
              }
              size="small"
              floated="right"
            />
          </div>

          <Form>
            <Form.Field>
              <Radio label="너무너무 쎄다" />
            </Form.Field>
            <Form.Field>
              <Radio label="중증 츤데레다" />
            </Form.Field>
            <Form.Field>
              <Radio label="화력계 라이플이다" />
            </Form.Field>
            <Form.Field>
              <Radio label="화력은 SS다" />
            </Form.Field>
          </Form>
        </Segment>
      </Grid.Row>
    </Grid>
  </div>
);

export default Problem;
