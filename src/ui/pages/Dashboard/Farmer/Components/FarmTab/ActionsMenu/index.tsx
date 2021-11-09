import React, { useCallback } from 'react';
import { MenuItem, Button, ListItemText } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core';
import MenuPopover from '~ui/atoms/MenuPopover/MenuPopover';
import { Icon } from '@iconify/react';
import mapIcon from '@iconify/icons-ic/map';
import arrowIosDownwardOutline from '@iconify/icons-eva/arrow-ios-downward-outline';
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';

type ActionsMenuProps = {
  farms: any[];
  setFarm: any;
  value: string;
  currentTab: string;
  handleChangeTab: (value: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles((theme: Theme) => ({
  menuItem: {
    padding: '15px',

    '&:hover': {
      backgroundColor: '#919EAB25'
    }
  }
}));

const ActionsMenu: React.FC<ActionsMenuProps> = (props: ActionsMenuProps) => {
  const classes = useStyles();
  const { farms, setFarm, value, handleChangeTab, currentTab } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOnClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMenuClick = useCallback((): void => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <Button
        onClick={handleOnClick}
        style={
          currentTab === value
            ? { color: '#212B36', marginRight: '40px', borderBottom: '2px solid #00AB55', borderRadius: '0px' }
            : { color: '#637381', marginRight: '40px', borderRadius: '0px' }
        }
        startIcon={<Icon icon={mapIcon} width={20} height={20} />}
        endIcon={
          <Icon icon={Boolean(anchorEl) ? arrowIosUpwardFill : arrowIosDownwardOutline} width={20} height={20} />
        }>
        Unidades productivas
      </Button>

      <MenuPopover sx={{ paddingTop: '7px' }} open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
        {farms?.map((item: any, index: number) => {
          return (
            <MenuItem
              key={`farms_item_${index}`}
              onClick={() => {
                setFarm(item);
                handleMenuClick();
                handleChangeTab(value);
              }}
              className={classes.menuItem}>
              <ListItemText primary={item?.name} />
            </MenuItem>
          );
        })}
      </MenuPopover>
    </>
  );
};

export default React.memo(ActionsMenu);
