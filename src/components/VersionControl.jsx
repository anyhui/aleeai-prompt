import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemButton, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import { History as HistoryIcon, Compare as CompareIcon } from '@mui/icons-material';
import { borderRadius, blur, gradients, shadows } from '../styles/constants';

/**
 * 提示词版本控制组件
 * 用于显示提示词的历史版本并提供版本比较功能
 */
const VersionControl = ({
  versions = [],
  currentVersion,
  onVersionSelect,
  onCompareVersions
}) => {
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [compareResult, setCompareResult] = useState({
    version1: null,
    version2: null,
    differences: []
  });

  // 处理版本选择
  const handleVersionSelect = (version) => {
    if (onVersionSelect) {
      onVersionSelect(version);
    }
  };

  // 处理版本比较选择
  const handleCompareSelect = (version) => {
    if (selectedVersions.includes(version.id)) {
      setSelectedVersions(selectedVersions.filter(id => id !== version.id));
    } else {
      if (selectedVersions.length < 2) {
        setSelectedVersions([...selectedVersions, version.id]);
      } else {
        // 如果已经选择了两个版本，替换第一个
        setSelectedVersions([selectedVersions[1], version.id]);
      }
    }
  };

  // 执行版本比较
  const handleCompare = () => {
    if (selectedVersions.length !== 2) return;
    
    const version1 = versions.find(v => v.id === selectedVersions[0]);
    const version2 = versions.find(v => v.id === selectedVersions[1]);
    
    if (version1 && version2 && onCompareVersions) {
      const result = onCompareVersions(version1, version2);
      setCompareResult({
        version1,
        version2,
        differences: result
      });
      setCompareDialogOpen(true);
    }
  };

  return (
    <Box sx={{
      borderRadius: borderRadius.lg,
      backdropFilter: blur.lg,
      background: theme => theme.palette.mode === 'dark' ? gradients.dark.primary : gradients.light.primary,
      boxShadow: theme => theme.palette.mode === 'dark'
        ? `${shadows.lg} rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)`
        : `${shadows.lg} rgba(99, 102, 241, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.8)`,
      p: 2
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <HistoryIcon sx={{ mr: 1 }} /> 版本历史
        </Typography>
        {selectedVersions.length === 2 && (
          <Button 
            variant="contained" 
            startIcon={<CompareIcon />}
            onClick={handleCompare}
            size="small"
          >
            比较版本
          </Button>
        )}
      </Box>
      
      <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
        {versions.length === 0 ? (
          <Typography variant="body2" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            暂无历史版本
          </Typography>
        ) : (
          versions.map((version, index) => (
            <React.Fragment key={version.id}>
              {index > 0 && <Divider />}
              <ListItem 
                disablePadding
                secondaryAction={
                  <Button 
                    size="small" 
                    color={selectedVersions.includes(version.id) ? "primary" : "inherit"}
                    onClick={() => handleCompareSelect(version)}
                  >
                    {selectedVersions.includes(version.id) ? "已选择" : "选择比较"}
                  </Button>
                }
              >
                <ListItemButton 
                  selected={currentVersion?.id === version.id}
                  onClick={() => handleVersionSelect(version)}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemText 
                    primary={`版本 ${version.versionNumber}`}
                    secondary={
                      <>
                        <Typography variant="caption" component="span" display="block">
                          {new Date(version.timestamp).toLocaleString()}
                        </Typography>
                        {version.changeDescription && (
                          <Typography variant="caption" component="span" display="block">
                            {version.changeDescription}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </React.Fragment>
          ))
        )}
      </List>

      {/* 版本比较对话框 */}
      <Dialog 
        open={compareDialogOpen} 
        onClose={() => setCompareDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>版本比较</DialogTitle>
        <DialogContent>
          {compareResult.version1 && compareResult.version2 && (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    版本 {compareResult.version1.versionNumber}
                    <Typography variant="caption" component="span" sx={{ ml: 1 }}>
                      ({new Date(compareResult.version1.timestamp).toLocaleString()})
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    版本 {compareResult.version2.versionNumber}
                    <Typography variant="caption" component="span" sx={{ ml: 1 }}>
                      ({new Date(compareResult.version2.timestamp).toLocaleString()})
                    </Typography>
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                {compareResult.differences.length > 0 ? (
                  compareResult.differences.map((diff, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{
                            p: 1,
                            backgroundColor: diff.type === 'removed' ? 'rgba(255, 0, 0, 0.1)' : 
                                           diff.type === 'changed' ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
                            borderRadius: 1
                          }}>
                            {diff.oldText}
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{
                            p: 1,
                            backgroundColor: diff.type === 'added' ? 'rgba(0, 255, 0, 0.1)' : 
                                           diff.type === 'changed' ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
                            borderRadius: 1
                          }}>
                            {diff.newText}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    两个版本内容相同
                  </Typography>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompareDialogOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VersionControl;