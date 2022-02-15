import React from 'react';
import { Icon, SidebarPortal } from '@plone/volto/components';
import calendarSVG from '@plone/volto/icons/calendar.svg';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import FullCalendarBlockView from './View';
import FullCalendarBlockSchema from './schema';

const FullCalendarBlockEdit = (props) => {
  const schema = FullCalendarBlockSchema(props.intl);

  React.useEffect(() => {
    const initialValues = {};

    Object.keys(schema.properties).forEach((key) => {
      if (schema.properties[key].hasOwnProperty('initialValue')) {
        initialValues[key] = schema.properties[key].initialValue;
      }
    });
    props.onChangeBlock(props.block, {
      ...initialValues,
      ...props.data,
    });
  }, []);

  return (
    <>
      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={schema}
          title={schema.title}
          icon={<Icon name={calendarSVG} />}
          onChangeField={(id, value) => {
            props.onChangeBlock(props.block, {
              ...props.data,
              [id]: value,
            });
          }}
          formData={props.data}
        />
      </SidebarPortal>
      <FullCalendarBlockView data={props.data} />
    </>
  );
};

export default FullCalendarBlockEdit;
